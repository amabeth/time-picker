import { View, type ViewStyle } from "react-native";
import STYLES from "../constants/STYLES";
import InlinePicker from "./inlinePicker";
import ModalPicker from "./modalPicker";

export default function App() {
  return (
    <View style={appStyle}>
      <ModalPicker />
      <View style={separatorStyle} />
      <InlinePicker />
    </View>
  );
}

const appStyle: ViewStyle = {
  ...STYLES.container,
  flex: 1,
  paddingHorizontal: 15,
  paddingVertical: 100
};

const separatorStyle: ViewStyle = {
  height: 70
};
