import type { Duration } from "../services/duration";
import { type LayoutChangeEvent, Text, type TextStyle, View, type ViewStyle } from "react-native";
import { RepeatingWheelPicker, type RepeatingWheelPickerProps } from "@amabeth/repeating-wheel-picker";
import { type TimePickerProps, timePickerPropsWithDefaults } from "../services/timePickerProps";
import { useMemo } from "react";
import { useMaxDimensions } from "../hooks/useDimensions";

const HOURS_DATA = [...Array(24).keys()];
const MINUTES_DATA = [...Array(60).keys()];
const SECONDS_DATA = [...Array(60).keys()];

/**
 * Provides a row of up to three wheel pickers representing hours, minutes and seconds.
 *
 * @param duration to display
 * @param setDuration function to set selected duration
 * @param properties for the picker row
 */
export function WheelPickerRow({
  duration,
  setDuration,
  properties
}: {
  duration: Duration;
  setDuration: (d: Duration) => void;
  properties: TimePickerProps;
}) {
  // set defaults for all unprovided optional properties
  const props = useMemo(
    () => timePickerPropsWithDefaults(properties),
    [properties]
  );
  // get picker height to center colons
  const { height: topRowHeight, onLayout: onTopRowHeightLayout } =
    useMaxDimensions();
  // ensure equal width across all pickers and labels
  const { width: maxWidth, onLayout: onMaxWidthLayout } = useMaxDimensions();

  // add leading zero to label if specified and value is only one digit long
  const getLabel = (n: number) =>
    properties.addLeadingZeros && n < 10 ? "0" + String(n) : String(n);
  // for pickers get height and width
  const onPickerLayout = (event: LayoutChangeEvent) => {
    onTopRowHeightLayout(event);
    onMaxWidthLayout(event);
  };

  // common props passed to all pickers
  const baseProps: Partial<RepeatingWheelPickerProps<number>> = {
    enabled: props.pickersEnabled,
    getLabel: getLabel,

    itemHeight: props.pickerItemHeight,
    itemDisplayCount: props.pickerItemDisplayCount ?? 3,

    containerVerticalPadding: props.pickerContainerVerticalPadding,
    containerHorizontalPadding: props.pickerContainerHorizontalPadding,
    containerStyle: props.hoursPickerContainerStyle,

    itemContainerStyle: props.pickerItemContainerStyle,
    itemTextStyle: props.hoursPickerItemTextStyle,

    enableGradient: props.enableGradient,
    gradientFadeColor: props.gradientColor
  };

  const rowStyle: ViewStyle = {
    flexDirection: "row"
  };

  return (
    <View style={[props.containerStyle, rowStyle]}>
      {/* hours */}
      {props.showHours && (
        <View style={rowStyle}>
          <Picker
            setSelected={(n: number) => setDuration({ ...duration, hours: n })}
            initialIndex={duration.hours}
            data={HOURS_DATA}
            width={maxWidth}
            baseProps={baseProps}
            labelStyle={props.hoursTimeLabelStyle}
            label={props.showTimeLabels ? props.hoursTimeLabel : undefined}
            onPickerLayout={onPickerLayout}
            onLabelLayout={onMaxWidthLayout}
          />
          {(props.showMinutes || props.showSeconds) && (
            <Colon height={topRowHeight} style={props.colonStyle} />
          )}
        </View>
      )}
      {/* minutes */}
      {props.showMinutes && (
        <View style={rowStyle}>
          <Picker
            setSelected={(n: number) =>
              setDuration({ ...duration, minutes: n })
            }
            initialIndex={duration.minutes}
            data={MINUTES_DATA}
            width={maxWidth}
            baseProps={baseProps}
            labelStyle={props.minutesTimeLabelStyle}
            label={props.showTimeLabels ? props.minutesTimeLabel : undefined}
            onPickerLayout={onPickerLayout}
            onLabelLayout={onMaxWidthLayout}
          />
          {props.showSeconds && (
            <Colon height={topRowHeight} style={props.colonStyle} />
          )}
        </View>
      )}
      {/* seconds */}
      {props.showSeconds && (
        <Picker
          setSelected={(n: number) => setDuration({ ...duration, seconds: n })}
          initialIndex={duration.seconds}
          data={SECONDS_DATA}
          width={maxWidth}
          baseProps={baseProps}
          labelStyle={props.secondsTimeLabelStyle}
          label={props.showTimeLabels ? props.secondsTimeLabel : undefined}
          onPickerLayout={onPickerLayout}
          onLabelLayout={onMaxWidthLayout}
        />
      )}
    </View>
  );
}

/**
 * Single wheel picker for one measure.
 *
 * @param setSelected function to update selected value
 * @param initialIndex initial value
 * @param data all values for the wheel picker
 * @param width for the container
 * @param baseProps props shared by all wheel pickers of the row
 * @param labelStyle style for the picker label
 * @param label text for the picker label
 * @param onPickerLayout function to monitor layout of picker
 * @param onLabelLayout function to monitor layout of label
 */
function Picker({
  setSelected,
  initialIndex,
  data,
  width,
  baseProps,
  labelStyle,
  label,
  onPickerLayout,
  onLabelLayout
}: {
  setSelected: (n: number) => void;
  initialIndex: number;
  data: number[];
  width: number;
  baseProps: Partial<RepeatingWheelPickerProps<number>>;
  labelStyle: TextStyle;
  label?: string;
  onPickerLayout?: (event: LayoutChangeEvent) => void;
  onLabelLayout?: (event: LayoutChangeEvent) => void;
}) {
  return (
    <View style={{ minWidth: width }}>
      <View onLayout={onPickerLayout}>
        <RepeatingWheelPicker<number>
          setSelected={setSelected}
          initialIndex={initialIndex}
          data={data}
          {...baseProps}
        />
      </View>
      {label !== undefined && (
        <Text style={labelStyle} onLayout={onLabelLayout}>
          {label}
        </Text>
      )}
    </View>
  );
}

/**
 * Colon to show between the wheel pickers.
 *
 * @param height of the container
 * @param style for the colon text
 */
function Colon({ height, style }: { height: number; style: TextStyle }) {
  const containerStyle: ViewStyle = {
    height: height,
    justifyContent: "center",
    alignItems: "center"
  };

  return (
    <View style={containerStyle}>
      <Text style={style}>:</Text>
    </View>
  );
}
