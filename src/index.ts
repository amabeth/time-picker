import { InlineTimePicker, type InlineTimePickerProps } from "./inlineTimePicker";
import { ModalTimePicker, type ModalTimePickerProps } from "./modalTimePicker";
import {
  cloneDuration,
  type Duration,
  durationEquals,
  durationFromDate,
  durationFromNow,
  durationFromSeconds,
  durationMinusSeconds,
  type DurationOperationError,
  durationsDifference,
  durationToDate,
  durationToSeconds,
  durationToString,
  isValid
} from "./services/duration";
import type { TimePickerProps } from "./services/timePickerProps";

export { type TimePickerProps };
export { InlineTimePicker, type InlineTimePickerProps };
export { ModalTimePicker, type ModalTimePickerProps };
export {
  type Duration,
  durationToString,
  durationToSeconds,
  durationFromSeconds,
  durationFromNow,
  durationFromDate,
  durationToDate,
  cloneDuration,
  durationsDifference,
  durationMinusSeconds,
  durationEquals,
  isValid,
  type DurationOperationError
};
