import { View } from "react-native";
import {
  type TimePickerProps,
  timePickerPropsWithDefaults
} from "./services/timePickerProps";
import { WheelPickerRow } from "./components/wheelPickerRow";
import type { Duration } from "./services/duration";
import { useMemo } from "react";

/**
 * Provides a time picker that can be included inline in a view. Includes up to 3 wheel pickers for selecting hours,
 * minutes and seconds that can be infinitely scrolled.
 *
 * @param properties configuration of the time picker
 */
export function InlineTimePicker(properties: InlineTimePickerProps) {
  // set defaults for all unprovided optional properties
  const props = useMemo(
    () => inlinePropsWithDefaults(properties),
    [properties]
  );

  return (
    <View style={props.containerStyle}>
      <WheelPickerRow
        duration={props.duration}
        setDuration={props.setDuration}
        properties={props}
      />
    </View>
  );
}

// props

/**
 * Set unprovided properties to default values.
 *
 * @param props configuration for inline time picker
 */
function inlinePropsWithDefaults(
  props: InlineTimePickerProps
): InlineTimePickerPropsWithDefaults {
  return {
    ...props,
    ...timePickerPropsWithDefaults(props)

    // optional
  };
}

type InlineTimePickerPropsWithDefaults = Required<InlineTimePickerProps>;

/**
 * Properties for an inline time picker extending the time picker props.
 */
export type InlineTimePickerProps = TimePickerProps & {
  /**
   * Function to set duration. Called when time picker is used.
   *
   * @example
   * ```ts
   * const [duration, setDuration] = useState({hours: 0, minutes: 15, seconds: 30});
   *
   * return (
   *  <InlineTimePicker
   *    setDuration={setDuration}
   *    //...
   *  />
   * );
   * ```
   *
   * @param d selected duration
   */
  setDuration: (d: Duration) => void;
};
