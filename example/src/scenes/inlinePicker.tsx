import { Text, type TextStyle, View } from "react-native";
import {
  durationFromSeconds,
  durationToString,
  InlineTimePicker,
  type InlineTimePickerProps
} from "@amabeth/time-picker";
import { useState } from "react";
import STYLES from "../constants/STYLES";

export default function InlinePicker() {
  // keep track of selected duration
  const [duration, setDuration] = useState(durationFromSeconds(0));

  const exampleProps: InlineTimePickerProps = {
    duration: duration,
    setDuration: setDuration,

    // optional
    containerStyle: STYLES.timeContainer,
    pickerContainerStyle: STYLES.pickerContainer,
    timeLabelsStyle: STYLES.text
  };

  return (
    <View>
      <InlineTimePicker {...exampleProps} />
      <Text style={durationTextStyle}>
        Selected duration: {durationToString(duration)}
      </Text>
    </View>
  );
}

const durationTextStyle: TextStyle = {
  ...STYLES.text,
  textAlign: "right",
  marginRight: 60,
  fontStyle: "italic"
};
