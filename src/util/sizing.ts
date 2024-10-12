import { useSignal } from '@preact/signals';
import { RefObject } from 'preact';
import { useMemo, useEffect } from 'preact/hooks';

export function useResizeObserver(elementRef: RefObject<HTMLElement>) {
    const width = useSignal(0);
    const height = useSignal(0);

    const resizeObserver = useMemo(
        () =>
            new ResizeObserver((entries) => {
                if (entries.length !== 1 || entries[0].borderBoxSize.length !== 1) {
                    console.warn('resize observer returned unexpected entries', entries);
                    return;
                }

                width.value = entries[0].borderBoxSize[0].inlineSize;
                height.value = entries[0].borderBoxSize[0].blockSize;
            }),
        [],
    );

    useEffect(() => {
        if (elementRef.current != null) {
            resizeObserver.observe(elementRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [elementRef.current]);

    return { width, height };
}

// assumes that `elementRef.current` contains a <span>, which it will temporarily
// modify to perform calculations
export function useLargestFontSizeForChildSpan(
    elementRef: RefObject<HTMLElement>,
    minFontSizePx: number,
    maxFontSizePx: number,
) {
    const { width, height } = useResizeObserver(elementRef);

    const fontSize = useSignal<number>(minFontSizePx);

    useEffect(() => {
        if (width.value === 0 || height.value === 0 || elementRef.current == null) {
            return;
        }

        const textSpan = elementRef.current.querySelector('span');
        if (textSpan == null) {
            console.warn('reference cell text span not found');
            return;
        }

        const originalSpanInnerHTML = textSpan.innerHTML;
        textSpan.innerHTML = '0';

        const originalSpanFontSize = textSpan.style.fontSize;

        // binary search for highest font size that fits
        // this is inspired by https://github.com/STRML/textFit/blob/master/textFit.js
        let low = minFontSizePx;
        let high = maxFontSizePx;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            textSpan.style.fontSize = `${mid}px`;

            const spanBoundingClientRect = textSpan.getBoundingClientRect();
            if (
                spanBoundingClientRect.width > width.value ||
                spanBoundingClientRect.height > height.value
            ) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        fontSize.value = low - 1;

        textSpan.innerHTML = originalSpanInnerHTML;
        textSpan.style.fontSize = originalSpanFontSize;
    }, [width.value, height.value]);

    return fontSize;
}
