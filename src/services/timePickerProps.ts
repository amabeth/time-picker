import { type Duration, durationToString, isValid } from "./duration";
import type { ColorValue, TextStyle, ViewStyle } from "react-native";

/**
 * Set unprovided properties to default values
 *
 * @param props configuration for a time picker
 */
export function timePickerPropsWithDefaults(
  props: TimePickerProps
): Required<TimePickerProps> {
  const defaultBackgroundColor = "black";
  const defaultTextColor = "white";

  validateProps(props);

  return {
    // mandatory
    duration: props.duration,

    // optional
    showHours: props.showHours ?? true,
    showMinutes: props.showMinutes ?? true,
    showSeconds: props.showSeconds ?? true,

    showTimeLabels: props.showTimeLabels ?? true,
    hoursTimeLabel: props.hoursTimeLabel ?? "Hours",
    minutesTimeLabel: props.minutesTimeLabel ?? "Minutes",
    secondsTimeLabel: props.secondsTimeLabel ?? "Seconds",
    addLeadingZeros: props.addLeadingZeros ?? false,

    containerStyle: {
      backgroundColor: "transparent",
      padding: 20,
      alignItems: "center",
      ...props.containerStyle
    },
    enableGradient: props.enableGradient ?? true,
    gradientColor:
      props.gradientColor ??
      props.pickerContainerStyle?.backgroundColor ??
      defaultBackgroundColor,
    colonStyle: {
      color: defaultTextColor,
      fontSize: 18,
      paddingBottom: 5,
      paddingHorizontal: 5,
      textAlign: "center",
      ...props.colonStyle
    },

    timeLabelsStyle: {
      color: defaultTextColor,
      textAlign: "center",
      fontSize: 14,
      ...props.timeLabelsStyle
    },
    hoursTimeLabelStyle: {
      ...props.timeLabelsStyle,
      ...props.hoursTimeLabelStyle
    },
    minutesTimeLabelStyle: {
      ...props.timeLabelsStyle,
      ...props.minutesTimeLabelStyle
    },
    secondsTimeLabelStyle: {
      ...props.timeLabelsStyle,
      ...props.secondsTimeLabelStyle
    },

    pickersEnabled: props.pickersEnabled ?? true,
    pickerItemHeight: props.pickerItemHeight ?? 35,
    pickerItemDisplayCount: props.pickerItemDisplayCount ?? 3,

    pickerContainerVerticalPadding: props.pickerContainerVerticalPadding ?? 0,
    pickerContainerHorizontalPadding:
      props.pickerContainerHorizontalPadding ?? 10,

    pickerContainerStyle: {
      backgroundColor: defaultBackgroundColor,
      ...props.pickerContainerStyle
    },
    hoursPickerContainerStyle: {
      alignItems: "center",
      ...props.pickerContainerStyle,
      ...props.hoursPickerContainerStyle
    },
    minutesPickerContainerStyle: {
      alignItems: "center",
      ...props.pickerContainerStyle,
      ...props.minutesPickerContainerStyle
    },
    secondsPickerContainerStyle: {
      alignItems: "center",
      ...props.pickerContainerStyle,
      ...props.secondsPickerContainerStyle
    },

    pickerItemContainerStyle: {
      backgroundColor: "transparent",
      ...props.pickerItemContainerStyle
    },
    pickerItemTextStyle: {
      color: defaultTextColor,
      fontSize: 18,
      ...props.pickerItemTextStyle
    },
    hoursPickerItemTextStyle: {
      ...props.pickerItemTextStyle,
      ...props.hoursPickerItemTextStyle
    },
    minutesPickerItemTextStyle: {
      ...props.pickerItemTextStyle,
      ...props.minutesPickerItemTextStyle
    },
    secondsPickerItemTextStyle: {
      ...props.pickerItemTextStyle,
      ...props.secondsPickerItemTextStyle
    }
  };
}

function validateProps(props: TimePickerProps) {
  if (!isValid(props.duration)) {
    throw InvalidPropertiesError(
      "duration",
      durationToString(props.duration),
      "Duration cannot be negative and minutes and seconds must be smaller than 60."
    );
  }

  if (props.pickerItemHeight !== undefined && props.pickerItemHeight < 1) {
    throw InvalidPropertiesError(
      "pickerItemHeight",
      String(props.pickerItemHeight),
      "has to be larger than 0"
    );
  }
}

function InvalidPropertiesError(
  propertyName: string,
  propertyValue: string,
  violatedConstraint: string
) {
  return Error(
    `Value "${propertyValue}" is invalid for property "${propertyName}": ${violatedConstraint}`
  ) as InvalidPropertiesError;
}

interface InvalidPropertiesError extends Error {
  name: "InvalidPropertiesError";
}

/**
 * Shared properties of time pickers.
 */
export type TimePickerProps = {
  /**
   * Duration to display.
   */
  duration: Duration;

  /**
   * If enabled, the time picker will include a wheel picker for the hours.
   *
   * @defaultValue true
   */
  showHours?: boolean;
  /**
   * If enabled, the time picker will include a wheel picker for the minutes.
   *
   * @defaultValue true
   */
  showMinutes?: boolean;
  /**
   * If enabled, the time picker will include a wheel picker for the seconds.
   *
   * @defaultValue true
   */
  showSeconds?: boolean;

  /**
   * If enabled, labels for the hours, minutes and seconds wheel picker will be displayed below.
   *
   * @defaultValue true
   */
  showTimeLabels?: boolean;
  /**
   * Label for the hours wheel picker.
   *
   * @defaultValue Hours
   */
  hoursTimeLabel?: string;
  /**
   * Label for the minutes wheel picker.
   *
   * @defaultValue Minutes
   */
  minutesTimeLabel?: string;
  /**
   * Label for the seconds wheel picker.
   *
   * @defaultValue Seconds
   */
  secondsTimeLabel?: string;
  /**
   * If enabled, a leading zero will be added to all one-digit time values. All time values will therefore be two digits long.
   *
   * @defaultValue false
   */
  addLeadingZeros?: boolean;

  /**
   * Styling for the container of the time picker.
   *
   * @defaultValue
   * ```ts
   *   {
   *     backgroundColor: "black"
   *   }
   * ```
   */
  containerStyle?: ViewStyle;
  /**
   * If enabled, will show a gradient fade towards the top and bottom of the wheel pickers.
   *
   * @defaultValue true
   */
  enableGradient?: boolean;
  /**
   * Color the gradient should fade to at the top and bottom.
   *
   * @defaultValue containerStyle.backgroundColor
   */
  gradientColor?: ColorValue;
  /**
   * Styling for the colon separating the wheel pickers.
   *
   * @defaultValue
   * ```ts
   *   {
   *     color: "white",
   *     fontSize: 18,
   *     paddingBottom: 5,
   *     paddingHorizontal: 5,
   *     textAlign: "center"
   *   }
   * ```
   */
  colonStyle?: TextStyle;

  /**
   * Styling for the labels of the wheel pickers.
   *
   * @defaultValue
   * ```ts
   *   {
   *     color: "white",
   *     textAlign: "center",
   *     fontSize: 14
   *   }
   * ```
   */
  timeLabelsStyle?: TextStyle;
  /**
   * Styling for the label of the hours wheel picker.
   *
   * @defaultValue timeLabelStyle
   */
  hoursTimeLabelStyle?: TextStyle;
  /**
   * Styling for the label of the minutes wheel picker.
   *
   * @defaultValue timeLabelStyle
   */
  minutesTimeLabelStyle?: TextStyle;
  /**
   * Styling for the label of the seconds wheel picker.
   *
   * @defaultValue timeLabelStyle
   */
  secondsTimeLabelStyle?: TextStyle;

  /**
   * Enables / disables scrolling of all wheel pickers.
   *
   * @defaultValue true
   */
  pickersEnabled?: boolean;

  /**
   * Height for an item of the wheel pickers.
   *
   * @defaultValue 35
   */
  pickerItemHeight?: number;
  /**
   * Number of items to display in every picker.
   *
   * @defaultValue 3
   */
  pickerItemDisplayCount?: number;

  /**
   * Vertical padding for the containers of the wheel pickers.
   *
   * @defaultValue 0
   */
  pickerContainerVerticalPadding?: number;
  /**
   * Horizontal padding for the containers of the wheel pickers.
   *
   * @defaultValue 10
   */
  pickerContainerHorizontalPadding?: number;

  /**
   * Styling for the containers of the wheel pickers.
   *
   * @defaultValue
   * ```ts
   *   {
   *     backgroundColor: "black"
   *   }
   * ```
   */
  pickerContainerStyle?: ViewStyle;
  /**
   * Styling for the container of the hours wheel picker.
   *
   * @defaultValue pickerContainerStyle
   */
  hoursPickerContainerStyle?: ViewStyle;
  /**
   * Styling for the container of the minutes wheel picker.
   *
   * @defaultValue pickerContainerStyle
   */
  minutesPickerContainerStyle?: ViewStyle;
  /**
   * Styling for the container of the seconds wheel picker.
   *
   * @defaultValue pickerContainerStyle
   */
  secondsPickerContainerStyle?: ViewStyle;

  /**
   * Styling for the containers of each element of the wheel pickers.
   *
   * @defaultValue
   * ```ts
   *   {
   *     backgroundColor: "transparent"
   *   }
   * ```
   */
  pickerItemContainerStyle?: ViewStyle;
  /**
   * Styling for the text of the elements of the wheel pickers.
   *
   * @defaultValue
   * ```ts
   *   {
   *     fontSize: 18,
   *     color: "white"
   *   }
   * ```
   */
  pickerItemTextStyle?: TextStyle;
  /**
   * Styling for the text of the elements of the hours wheel picker.
   *
   * @defaultValue pickerItemTextStyle
   */
  hoursPickerItemTextStyle?: TextStyle;
  /**
   * Styling for the text of the elements of the minutes wheel picker.
   *
   * @defaultValue pickerItemTextStyle
   */
  minutesPickerItemTextStyle?: TextStyle;
  /**
   * Styling for the text of the elements of the seconds wheel picker.
   *
   * @defaultValue pickerItemTextStyle
   */
  secondsPickerItemTextStyle?: TextStyle;
};
