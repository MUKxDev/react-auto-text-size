import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  JSX,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { autoTextSize, Options } from "./auto-text-size-standalone.js";

/**
 * Make text fit container, prevent overflow and underflow.
 */
export function AutoTextSize({
  mode,
  minFontSizePx,
  maxFontSizePx,
  fontSizePrecisionPx,
  as: Comp = "div", // TODO: The `...rest` props are not typed to reflect another `as`.
  children,
  ...rest
}: Options & {
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements;
} & DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >): ReactElement {
  const updateTextSizeRef = useRef<ReturnType<typeof autoTextSize> | null>(
    null
  );

  // In React 19, useEffect has changed to use a more explicit cleanup syntax
  useEffect(() => {
    return () => {
      updateTextSizeRef.current?.();
    };
  }, [children]);

  const refCallback = useCallback(
    (innerEl: HTMLElement | null) => {
      updateTextSizeRef.current?.disconnect();

      const containerEl = innerEl?.parentElement;
      if (!innerEl || !containerEl) return;

      updateTextSizeRef.current = autoTextSize({
        innerEl,
        containerEl,
        mode,
        minFontSizePx,
        maxFontSizePx,
        fontSizePrecisionPx,
      });
    },
    [mode, minFontSizePx, maxFontSizePx, fontSizePrecisionPx]
  );

  return (
    <Comp ref={refCallback} {...rest}>
      {children}
    </Comp>
  );
}
