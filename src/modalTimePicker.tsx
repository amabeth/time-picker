import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle
} from "react-native";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import { cloneDuration, type Duration } from "./services/duration";
import { WheelPickerRow } from "./components/wheelPickerRow";
import {
  type TimePickerProps,
  timePickerPropsWithDefaults
} from "./services/timePickerProps";

/**
 * Provides a time picker as a modal. Includes up to 3 wheel pickers for selecting hours, minutes and seconds that can
 * be infinitely scrolled.
 *
 * @param properties configuration of the time picker
 */
export function ModalTimePicker(properties: ModalTimePickerProps) {
  // set defaults for all unprovided optional properties
  const props = useMemo(() => modalPropsWithDefaults(properties), [properties]);

  // clone duration to not change provided duration until confirmation
  const [duration, setDuration] = useState(cloneDuration(props.duration));

  // reset duration to provided duration
  useEffect(() => {
    if (!props.visible) {
      setDuration(cloneDuration(props.duration));
    }
  }, [props.duration, props.visible]);

  const contentContainerStyle: ViewStyle = {
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    height: "100%",
    width: "100%"
  };

  return (
    <Modal
      isVisible={props.visible}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      statusBarTranslucent
      /* custom backdrop to manage tapping out */
      customBackdrop={Backdrop({ duration: duration, props: props })}
      backdropTransitionOutTiming={15}
    >
      <View style={contentContainerStyle}>
        {/* content inside the modal */}
        <Content duration={duration} setDuration={setDuration} props={props} />
      </View>
    </Modal>
  );
}

/**
 * Backdrop component that can be tapped to close the modal.
 *
 * @param duration currently selected duration
 * @param props time picker properties
 */
function Backdrop({
  duration,
  props
}: {
  duration: Duration;
  props: ModalTimePickerPropsWithDefaults;
}) {
  // function called when backdrop is tapped
  const onTapOut = () => {
    if (!props.allowTapOut) {
      return;
    }

    // choose function to call when user taps out
    switch (props.onTapOut) {
      case "confirm": {
        props.onConfirm(duration);
        break;
      }
      case "cancel": {
        props.onCancel(duration);
        break;
      }
    }

    // close modal
    props.setVisible(false);
  };
  const opacity = 0.5;

  const style: ViewStyle = {
    opacity: opacity,
    ...props.backdropStyle,

    alignSelf: "center",
    ...Dimensions.get("window")
  };

  return (
    <TouchableOpacity
      onPress={onTapOut}
      disabled={!props.allowTapOut}
      activeOpacity={opacity}
      style={style}
    />
  );
}

/**
 * Modal content including the actual time picker.
 *
 * @param duration currently selected duration
 * @param setDuration function to set the currently selected duration
 * @param props time picker properties
 */
function Content({
  duration,
  setDuration,
  props
}: {
  duration: Duration;
  setDuration: (d: Duration) => void;
  props: ModalTimePickerPropsWithDefaults;
}) {
  return (
    <View style={props.containerStyle}>
      <Title props={props} />
      <View style={props.titlePickerSeparatorStyle} />
      <WheelPickerRow
        duration={duration}
        setDuration={setDuration}
        properties={props}
      />
      <View style={props.pickerButtonsSeparatorStyle} />
      <Buttons duration={duration} setDuration={setDuration} props={props} />
    </View>
  );
}

/**
 * Modal title.
 *
 * @param props time picker properties
 */
function Title({ props }: { props: ModalTimePickerPropsWithDefaults }) {
  if (!props.showTitle) {
    return null;
  }

  return <Text style={props.titleStyle}>{props.title}</Text>;
}

/**
 * Container for cancel and confirm button.
 *
 * @param duration currently selected duration
 * @param props time picker properties
 */
function Buttons({
  duration,
  props
}: {
  duration: Duration;
  setDuration: (d: Duration) => void;
  props: ModalTimePickerPropsWithDefaults;
}) {
  if (!props.showCancel && !props.showConfirm) {
    return null;
  }

  return (
    <View style={props.buttonContainerStyle}>
      {props.showCancel && (
        <MaterialIcons
          name="close"
          onPress={() => onCancel(duration, props)}
          style={props.cancelButtonStyle}
        />
      )}
      {props.showCancel &&
        props.showConfirm && ( // show separator if both buttons are shown
          <View style={props.buttonSeparatorStyle} />
        )}
      {props.showConfirm && (
        <MaterialIcons
          name="check"
          onPress={() => onConfirm(duration, props)}
          style={props.confirmButtonStyle}
        />
      )}
    </View>
  );
}

/**
 * Called on cancel either by pressing the button or by tapping out. Calls `onCancel` from time picker properties and
 * hides modal.
 *
 * @param duration currently selected duration
 * @param props time picker properties
 */
function onCancel(duration: Duration, props: ModalTimePickerPropsWithDefaults) {
  props.onCancel(duration);
  props.setVisible(false);
}

/**
 * Called on confirm either by pressing the button or by tapping out. Calls `onConfirm` from time picker properties and
 * hides modal.
 *
 * @param duration currently selected duration
 * @param props time picker properties
 */
function onConfirm(
  duration: Duration,
  props: ModalTimePickerPropsWithDefaults
) {
  props.onConfirm(duration);
  props.setVisible(false);
}

// props

/**
 * Set unprovided properties to default values.
 *
 * @param props configuration for modal time picker
 */
function modalPropsWithDefaults(
  props: ModalTimePickerProps
): ModalTimePickerPropsWithDefaults {
  const defaultBackdropColor = "black";
  const defaultTextColor = "white";

  return {
    ...props,
    ...timePickerPropsWithDefaults(props),

    // optional
    showTitle: props.showTitle ?? true,
    title: props.title ?? "Select time",

    showConfirm: props.showConfirm ?? true,
    showCancel: props.showCancel ?? true,
    onCancel: props.onCancel ?? (() => {}),

    allowTapOut: props.allowTapOut ?? true,
    onTapOut: props.onTapOut ?? "cancel",

    containerStyle: {
      width: props.containerStyle?.width ?? "100%",
      ...props.containerStyle
    },
    backdropStyle: {
      backgroundColor:
        props.backdropStyle?.backgroundColor ?? defaultBackdropColor,
      ...props.backdropStyle
    },
    titleStyle: {
      color: props.titleStyle?.color ?? defaultTextColor,
      fontSize: props.titleStyle?.fontSize ?? 24,
      ...props.titleStyle
    },
    titlePickerSeparatorStyle: {
      height: 15,
      ...props.titlePickerSeparatorStyle
    },
    pickerButtonsSeparatorStyle: {
      height: 15,
      ...props.pickerButtonsSeparatorStyle
    },

    buttonContainerStyle: {
      flexDirection: "row",
      justifyContent: "flex-end",
      ...props.buttonContainerStyle
    },
    buttonSeparatorStyle: {
      width: 15,
      ...props.buttonSeparatorStyle
    },
    confirmButtonStyle: {
      fontSize: props.confirmButtonStyle?.fontSize ?? 24,
      padding: props.confirmButtonStyle?.padding ?? 5,
      color: props.confirmButtonStyle?.color ?? defaultTextColor,
      ...props.confirmButtonStyle
    },
    cancelButtonStyle: {
      fontSize: props.cancelButtonStyle?.fontSize ?? 24,
      padding: props.cancelButtonStyle?.padding ?? 5,
      color: props.cancelButtonStyle?.color ?? defaultTextColor,
      ...props.cancelButtonStyle
    }
  };
}

type ModalTimePickerPropsWithDefaults = Required<ModalTimePickerProps>;

/**
 * Properties for a modal time picker extending time picker props.
 */
export type ModalTimePickerProps = TimePickerProps & {
  /**
   * Defines if modal should currently be shown or not
   */
  visible: boolean;
  /**
   * Function to change modal visibility. Called to hide the modal when someone taps on the backdrop.
   *
   * @param b new visibility
   */
  setVisible: (b: boolean) => void;

  /**
   * Display a title in the modal.
   *
   * @defaultValue true
   */
  showTitle?: boolean;
  /**
   * Title to display.
   *
   * @defaultValue Select time
   */
  title?: string;

  /**
   * If enabled, the confirm button is shown.
   *
   * @defaultValue true
   */
  showConfirm?: boolean;
  /**
   * Function to call when the confirm button is pressed or the user taps out with `onTapOut` set to "confirm".
   *
   * @example
   * ```ts
   * const [duration, setDuration] = useState({hours: 0, minutes: 15, seconds: 30});
   *
   * return (
   *  <ModalTimePicker
   *    onConfirm={setDuration}
   *    //...
   *  />
   * );
   * ```
   *
   * @param duration currently selected in the time picker
   */
  onConfirm: (duration: Duration) => void;
  /**
   * If enabled, the cancel button is shown.
   *
   * @defaultValue true
   */
  showCancel?: boolean;
  /**
   * Function to call when the cancel button is pressed or the user taps out with `onTapOut` set to "cancel".
   *
   * @example
   * ```ts
   * const [duration, setDuration] = useState({hours: 0, minutes: 15, seconds: 30});
   * const [cachedDuration, setCachedDuration] = useState(cloneDuration(duration));
   *
   * useEffect(() => {
   *  setCachedDuration(cloneDuration(duration));
   * }, [duration]);
   *
   * return (
   *  <ModalTimePicker
   *    duration={cachedDuration} // when user cancels and reopens the time picker modal, show previously selected values
   *
   *    onConfirm={setDuration}
   *    onCancel={setCachedDuration}
   *    //...
   *  />
   * );
   * ```
   *
   * @defaultValue () => {}
   *
   * @param duration currently selected in the time picker
   */
  onCancel?: (duration: Duration) => void;

  /**
   * If enabled, user can close the modal by tapping on the backdrop.
   *
   * @defaultValue true
   */
  allowTapOut?: boolean;
  /**
   * Defines if tapping out should be considered cancelling or confirming. The corresponding function will be called on tap out.
   *
   * @defaultValue cancel
   */
  onTapOut?: "cancel" | "confirm";

  /**
   * Styling for the backdrop.
   *
   * @defaultValue
   * ```ts
   *   {
   *     backgroundColor: "black"
   *   }
   * ```
   */
  backdropStyle?: ViewStyle;
  /**
   * Styling for the title text.
   *
   * @defaultValue
   * ```ts
   *   {
   *     fontSize: 24,
   *     color: "white"
   *   }
   * ```
   */
  titleStyle?: TextStyle;
  /**
   * Styling for the separator between the title and time picker.
   *
   * @defaultValue
   * ```ts
   *   {
   *     height: 15
   *   }
   * ```
   */
  titlePickerSeparatorStyle?: ViewStyle;
  /**
   * Styling for the separator between the time picker and buttons.
   *
   * @defaultValue
   * ```ts
   *   {
   *     height: 15
   *   }
   * ```
   */
  pickerButtonsSeparatorStyle?: ViewStyle;

  /**
   * Styling for the button container.
   *
   * @defaultValue
   * ```ts
   *   {
   *     flexDirection: "row",
   *     justifyContent: "flex-end"
   *   }
   * ```
   */
  buttonContainerStyle?: ViewStyle;
  /**
   * Styling for the separator between the buttons.
   *
   * @defaultValue
   * ```ts
   *   {
   *     height: 15
   *   }
   * ```
   */
  buttonSeparatorStyle?: ViewStyle;
  /**
   * Styling for the confirm button.
   *
   * @defaultValue
   * ```ts
   *   {
   *     fontSize: 24,
   *     padding: 5,
   *     color: "white"
   *   }
   * ```
   */
  confirmButtonStyle?: TextStyle;
  /**
   * Styling for the cancel button.
   *
   * @defaultValue
   * ```ts
   *   {
   *     fontSize: 24,
   *     padding: 5,
   *     color: "white"
   *   }
   * ```
   */
  cancelButtonStyle?: TextStyle;
};
