import { StyleSheet } from "react-native";

export const COLORS = {
  container: "#0F1417",
  tile: "#0F1417",
  outline: "#303036",
  highlight: "#34343A",
  text: "#E4E1E9"
};

const STYLES = StyleSheet.create({
  container: {
    backgroundColor: COLORS.container,
    padding: 5
  },
  tile: {
    backgroundColor: COLORS.tile,
    paddingHorizontal: 15,
    paddingVertical: 10,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.outline
  },
  timeContainer: {
    backgroundColor: COLORS.highlight,
    padding: 10,
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.outline
  },
  pickerContainer: {
    backgroundColor: COLORS.highlight
  },
  title: {
    color: COLORS.text,
    fontSize: 20
  },
  subtitle: {
    color: COLORS.text,
    fontSize: 18
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 5
  }
});

export default STYLES;
