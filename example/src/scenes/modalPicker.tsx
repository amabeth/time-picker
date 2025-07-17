import {
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle
} from "react-native";
import {
  type Duration,
  durationFromSeconds,
  durationToString,
  ModalTimePicker,
  type ModalTimePickerProps
} from "@amabeth/time-picker";
import { useState } from "react";
import STYLES from "../constants/STYLES";

export default function ModalPicker() {
  // keep track of modal state and selected duration
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(durationFromSeconds(8592));

  // update duration when user confirms in modal
  const onConfirm = (d: Duration) => setDuration(d);

  const exampleProps: ModalTimePickerProps = {
    duration: duration,

    visible: showModal,
    setVisible: setShowModal,

    onConfirm: onConfirm,

    //optional
    showHours: true,
    showMinutes: true,
    showSeconds: false,

    containerStyle: containerStyle,
    pickerContainerStyle: STYLES.pickerContainer
  };

  return (
    <View>
      <View style={rowStyle}>
        <Text style={STYLES.title}>
          {durationToString(duration, {
            hours: true,
            minutes: true,
            seconds: false
          })}
        </Text>
        <TouchableOpacity
          onPress={() => setShowModal(!showModal)}
          style={buttonStyle}
        >
          <Text style={buttonTextStyle}>Change time</Text>
        </TouchableOpacity>
      </View>
      <ModalTimePicker {...exampleProps} />
    </View>
  );
}

const rowStyle: ViewStyle = {
  ...STYLES.tile,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
};

const containerStyle: ViewStyle = {
  ...STYLES.timeContainer,
  borderRadius: 15,
  padding: 15,
  justifyContent: "center",
  borderWidth: 0
};

const buttonStyle: ViewStyle = {
  alignSelf: "center"
};

const buttonTextStyle: TextStyle = {
  ...STYLES.subtitle,
  fontStyle: "italic"
};
