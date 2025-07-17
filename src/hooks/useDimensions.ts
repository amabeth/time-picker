import { useCallback, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

export type TrackedDimensions = {
  width: number;
  height: number;
  onLayout: (event: LayoutChangeEvent) => void;
};

/**
 * Provides onLayout function and resulting height and width. If onLayout is called multiple time, maximum value will be saved.
 */
export function useMaxDimensions(): TrackedDimensions {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const layout = event.nativeEvent.layout;

      const width = Math.max(dimensions.width, layout.width);
      const height = Math.max(dimensions.height, layout.height);

      if (dimensions.width !== width || dimensions.height !== height) {
        setDimensions({ width, height });
      }
    },
    [dimensions.height, dimensions.width]
  );

  return {
    width: dimensions.width,
    height: dimensions.height,
    onLayout: onLayout
  };
}
