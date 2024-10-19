import { useEffect } from 'preact/hooks';
import { InitialBoardCreationOptions, useBoard } from './useBoard';
import Peer, { DataConnection, PeerOptions } from 'peerjs';
import { Board } from './board';
import { BoardAction } from './action';
import { ReadonlySignal, useSignal } from '@preact/signals';

type ConnectionOptions = {
    token: string;
    shouldHost: boolean;
};

type ConnectionEvent =
    | {
          type: 'initial-board';
          board: Board;
          solution: Board;
      }
    | {
          type: 'action';
          action: BoardAction;
      }
    | {
          type: 'user-join';
          user: User;
      };

const userColors = ['orange', 'purple', 'sky', 'lime'] as const;
export type UserColor = (typeof userColors)[number];

export type User = {
    id: string;
    color: UserColor;
};

const commonPeerOptions: PeerOptions = {
    debug: 3,
    config: {
        iceServers: [
            { urls: 'stun:freestun.net:3478' },
            { urls: 'turn:freestun.net:3478', username: 'free', credential: 'free' },
        ],
    },
};

const peerIdPrefix = 'space-fsoc-multoku-';

function connectionTokenToDistributorId(token: string): string {
    return peerIdPrefix + token;
}

function setupPeerDebugLogs(peer: Peer, tag: string) {
    peer.on('open', (id) => {
        console.log(`${tag} connected to brokering server with id`, id);
    });

    peer.on('connection', (connection: DataConnection) => {
        console.log(`${tag} got connection from`, connection.peer);

        connection.on('open', () => {
            console.debug(`${tag} connection opened with`, connection.peer);
        });

        connection.on('data', (data) => {
            console.debug(`${tag} got data from`, connection.peer, data);
        });

        connection.on('close', () => {
            console.debug(`${tag} connection closed with`, connection.peer);
        });

        connection.on('error', (error) => {
            console.error(`${tag} peer error`, error);
        });

        connection.on('iceStateChanged', (state) => {
            console.debug(`${tag} ice state changed`, state);
        });
    });
}

function setupEventDistributor(
    token: string,
    board: ReadonlySignal<Board | null>,
    solution: ReadonlySignal<Board | null>,
) {
    const distributorPeerId = connectionTokenToDistributorId(token);
    const distributor = new Peer(distributorPeerId, commonPeerOptions);

    setupPeerDebugLogs(distributor, '[distributor]');

    const connectionsToDistributor = new Map<string, DataConnection>();

    function sendEvent(event: ConnectionEvent, connection: DataConnection) {
        connection.send(JSON.stringify(event));
    }

    function broadcastEvent(event: ConnectionEvent) {
        for (const connection of connectionsToDistributor.values()) {
            sendEvent(event, connection);
        }
    }

    function broadcastData(data: unknown) {
        for (const connection of connectionsToDistributor.values()) {
            connection.send(data);
        }
    }

    distributor.on('connection', (connection: DataConnection) => {
        connection.on('open', () => {
            connectionsToDistributor.set(connection.peer, connection);

            if (board.value != null && solution.value != null) {
                sendEvent(
                    { type: 'initial-board', board: board.value, solution: solution.value },
                    connection,
                );

                broadcastEvent({
                    type: 'user-join',
                    user: { id: connection.peer, color: userColors[connectionsToDistributor.size] },
                });
            } else {
                console.error('board not initialized on connection open');
            }
        });

        connection.on('data', (data) => {
            broadcastData(data);
        });
    });

    return () => {
        console.log('[distributor] destroying');

        distributor.destroy();
    };
}

function useConnectionToDistributor(token: string, onEvent: (event: ConnectionEvent) => void) {
    const connectionToDistributor = useSignal<DataConnection | null>(null);

    useEffect(() => {
        const peer = new Peer(commonPeerOptions);

        setupPeerDebugLogs(peer, '[client]');

        peer.on('open', () => {
            connectionToDistributor.value = peer.connect(connectionTokenToDistributorId(token));

            connectionToDistributor.value.on('data', (data) => {
                const event = JSON.parse(data as string) as ConnectionEvent;

                onEvent(event);
            });
        });

        return () => {
            console.log('[client] destroying');

            peer.destroy();
            connectionToDistributor.value?.close();
            connectionToDistributor.value = null;
        };
    }, [token]);

    function sendEvent(event: ConnectionEvent) {
        if (connectionToDistributor.value == null) {
            console.error('cannot send event, not connected to distributor');
            return;
        }

        connectionToDistributor.value.send(JSON.stringify(event));
    }

    return { sendEvent };
}

export function useConnectedBoard(
    initialBoardCreationOptions: InitialBoardCreationOptions,
    connectionOptions: ConnectionOptions,
) {
    const { board, solution, performBoardAction, setBoardAndSolution } = useBoard(
        initialBoardCreationOptions,
    );

    useEffect(() => {
        if (connectionOptions.shouldHost) {
            return setupEventDistributor(connectionOptions.token, board, solution);
        }

        return () => {};
    }, [connectionOptions]);

    function onEvent(event: ConnectionEvent) {
        switch (event.type) {
            case 'initial-board':
                setBoardAndSolution(event.board, event.solution);
                break;

            case 'action':
                performBoardAction(event.action);
                break;
        }
    }

    const { sendEvent } = useConnectionToDistributor(connectionOptions.token, onEvent);

    function sendBoardAction(action: BoardAction) {
        sendEvent({ type: 'action', action });
    }

    return { board, sendBoardAction };
}
