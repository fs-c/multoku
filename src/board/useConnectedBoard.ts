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
      }
    | {
          type: 'action';
          action: BoardAction;
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

function setupEventDistributor(token: string, board: ReadonlySignal<Board | null>) {
    const distributorPeerId = connectionTokenToDistributorId(token);
    const distributor = new Peer(distributorPeerId, commonPeerOptions);

    setupPeerDebugLogs(distributor, '[distributor]');

    const connectionsToDistributor = new Map<string, DataConnection>();

    function sendEvent(event: ConnectionEvent, connection: DataConnection) {
        connection.send(JSON.stringify(event));
    }

    function broadcastData(data: unknown) {
        for (const connection of connectionsToDistributor.values()) {
            connection.send(data);
        }
    }

    distributor.on('connection', (connection: DataConnection) => {
        connection.on('open', () => {
            connectionsToDistributor.set(connection.peer, connection);

            if (board.value != null) {
                sendEvent({ type: 'initial-board', board: board.value }, connection);
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

function useConnectionToDistributor(
    token: string,
    performBoardAction: (action: BoardAction) => void,
    setBoard: (board: Board) => void,
) {
    const connectionToDistributor = useSignal<DataConnection | null>(null);

    useEffect(() => {
        const peer = new Peer(commonPeerOptions);

        setupPeerDebugLogs(peer, '[client]');

        peer.on('open', () => {
            connectionToDistributor.value = peer.connect(connectionTokenToDistributorId(token));

            connectionToDistributor.value.on('data', (data) => {
                const event = JSON.parse(data as string) as ConnectionEvent;

                switch (event.type) {
                    case 'initial-board': {
                        setBoard(event.board);
                        break;
                    }
                    case 'action': {
                        performBoardAction(event.action);
                        break;
                    }
                }
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
    const { board, performBoardAction, setBoard } = useBoard(initialBoardCreationOptions);

    useEffect(() => {
        if (connectionOptions.shouldHost) {
            return setupEventDistributor(connectionOptions.token, board);
        }

        return () => {};
    }, [connectionOptions]);

    const { sendEvent } = useConnectionToDistributor(
        connectionOptions.token,
        performBoardAction,
        setBoard,
    );

    function sendBoardAction(action: BoardAction) {
        sendEvent({ type: 'action', action });
    }

    return { board, performBoardAction: sendBoardAction };
}
