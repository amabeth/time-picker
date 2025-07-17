const HOURS_TO_MINUTES = 60;
const MINUTES_TO_SECONDS = 60;
const HOURS_TO_SECONDS = MINUTES_TO_SECONDS * HOURS_TO_MINUTES;

const VALID_CONSTRAINT =
  "Duration has to be positive and minutes and seconds have to be smaller than 60.";

/**
 * Type for time managed by time picker
 */
export type Duration = {
  hours: number;
  minutes: number;
  seconds: number;
};

export {
  durationToString,
  durationToSeconds,
  durationFromSeconds,
  cloneDuration,
  durationsSum,
  durationsDifference,
  durationPlusSeconds,
  durationMinusSeconds,
  durationEquals,
  isValid
};

/**
 * Transform duration to string representation. Adds leading zero for one digit hours, minutes or seconds. Can only
 * output part of the duration e.g. only hours and minutes. Optionally add units like "h", "m" and "s".
 *
 * @param duration to transform into string
 * @param include which parts of the duration should be included
 * @param units to display after hours, minutes and seconds
 */
function durationToString(
  duration: Duration,
  include = { hours: true, minutes: true, seconds: true },
  units = { hours: "", minutes: "", seconds: "" }
): string {
  if (!isValid(duration)) {
    throw new DurationOperationError(
      "durationToString",
      [
        { name: "duration", value: JSON.stringify(duration) },
        { name: "include", value: JSON.stringify(include) },
        { name: "units", value: JSON.stringify(units) }
      ],
      VALID_CONSTRAINT
    );
  }

  // if nothing should be included, return empty string
  if (!include.hours && !include.minutes && !include.seconds) {
    return "";
  }

  let result = "";

  if (include.hours) {
    // add hours to result, if needed with leading zero, and add colon if minutes or seconds follow
    result +=
      (duration.hours < 10 ? "0" : "") +
      duration.hours +
      units.hours +
      (include.minutes || include.seconds ? ":" : "");
  }

  if (include.minutes) {
    // add minutes to result, if needed with leading zero, and add colon if seconds follow
    result +=
      (duration.minutes < 10 ? "0" : "") +
      duration.minutes +
      units.minutes +
      (include.seconds ? ":" : "");
  }

  if (include.seconds) {
    // add seconds to result, if needed with leading zero
    result +=
      (duration.seconds < 10 ? "0" : "") + duration.seconds + units.seconds;
  }

  return result;
}

/**
 * Convert duration into seconds.
 *
 * @param duration to convert
 */
function durationToSeconds(duration: Duration): number {
  if (!isValid(duration)) {
    throw new DurationOperationError(
      "durationToSeconds",
      [{ name: "duration", value: JSON.stringify(duration) }],
      VALID_CONSTRAINT
    );
  }

  return (
    duration.hours * HOURS_TO_SECONDS +
    duration.minutes * MINUTES_TO_SECONDS +
    duration.seconds
  );
}

/**
 * Convert seconds into duration.
 *
 * @param seconds to convert
 */
function durationFromSeconds(seconds: number): Duration {
  if (seconds < 0) {
    throw new DurationOperationError(
      "durationFromSeconds",
      [{ name: "seconds", value: String(seconds) }],
      "Seconds have to be greater or equal to 0"
    );
  }

  return {
    hours: hoursFromSeconds(seconds),
    minutes: minutesFromSeconds(seconds),
    seconds: seconds % MINUTES_TO_SECONDS
  };
}

/**
 * Clone duration into new object with the same values.
 *
 * @param duration to clone
 */
function cloneDuration(duration: Duration): Duration {
  if (!isValid(duration)) {
    throw new DurationOperationError(
      "cloneDuration",
      [{ name: "duration", value: JSON.stringify(duration) }],
      VALID_CONSTRAINT
    );
  }

  return {
    hours: duration.hours,
    minutes: duration.minutes,
    seconds: duration.seconds
  };
}

/**
 * Sum up all provided durations.
 *
 * @param durations to sum up
 */
function durationsSum(...durations: Duration[]): Duration {
  const invalidDuration = findInvalid(durations);
  if (invalidDuration !== undefined) {
    throw new DurationOperationError(
      "durationsSum",
      [
        {
          name: "durations",
          value: `[${durations.map((duration) => JSON.stringify(duration)).join(", ")}]`
        }
      ],
      `Duration ${JSON.stringify(invalidDuration)} is invalid. ${VALID_CONSTRAINT}`
    );
  }

  return durations.reduce((sum: Duration, duration: Duration) =>
    durationPlusSeconds(sum, durationToSeconds(duration))
  );
}

/**
 * Subtract all other provided durations from the first one.
 *
 * @param durations to subtract from first element
 */
function durationsDifference(...durations: Duration[]): Duration {
  const invalidDuration = findInvalid(durations);
  if (invalidDuration !== undefined) {
    throw new DurationOperationError(
      "durationsSum",
      [
        {
          name: "durations",
          value: `[${durations.map((duration) => JSON.stringify(duration)).join(", ")}]`
        }
      ],
      `Duration ${JSON.stringify(invalidDuration)} is invalid. ${VALID_CONSTRAINT}`
    );
  }

  try {
    return durations.reduce((sum: Duration, duration: Duration) =>
      durationMinusSeconds(sum, durationToSeconds(duration))
    );
  } catch (error) {
    if (error instanceof DurationOperationError) {
      throw new DurationOperationError(
        "durationsDifference",
        [
          {
            name: "durations",
            value: `[${durations.map((duration) => durationToString(duration)).join(", ")}]`
          }
        ],
        "Subtracting all durations would lead to negative duration, which is invalid."
      );
    } else {
      throw error;
    }
  }
}

/**
 * Add seconds to duration
 *
 * @param duration to add seconds to
 * @param seconds to add
 */
function durationPlusSeconds(duration: Duration, seconds: number): Duration {
  if (!isValid(duration)) {
    throw new DurationOperationError(
      "cloneDuration",
      [
        { name: "duration", value: JSON.stringify(duration) },
        { name: "seconds", value: String(seconds) }
      ],
      VALID_CONSTRAINT
    );
  }
  if (seconds < 0) {
    throw new DurationOperationError(
      "durationPlusSeconds",
      [
        { name: "duration", value: durationToString(duration) },
        { name: "seconds", value: String(seconds) }
      ],
      "Negative seconds are invalid. Use 'durationMinusSeconds' to subtract seconds."
    );
  }

  let durationInSeconds = durationToSeconds(duration);

  durationInSeconds += seconds;

  return durationFromSeconds(durationInSeconds);
}

/**
 * Subtract seconds from duration.
 *
 * @param duration to subtract seconds from
 * @param seconds to subtract
 */
function durationMinusSeconds(duration: Duration, seconds: number): Duration {
  if (!isValid(duration)) {
    throw new DurationOperationError(
      "cloneDuration",
      [
        { name: "duration", value: JSON.stringify(duration) },
        { name: "seconds", value: String(seconds) }
      ],
      VALID_CONSTRAINT
    );
  }
  if (seconds < 0) {
    throw new DurationOperationError(
      "durationPlusSeconds",
      [
        { name: "duration", value: durationToString(duration) },
        { name: "seconds", value: String(seconds) }
      ],
      "Negative seconds are invalid. Use 'durationPlusSeconds' to add seconds."
    );
  }

  let durationInSeconds = durationToSeconds(duration);

  if (durationInSeconds < seconds) {
    throw new DurationOperationError(
      "durationMinusSeconds",
      [
        { name: "duration", value: durationToString(duration) },
        { name: "seconds", value: String(seconds) }
      ],
      "Seconds are larger than duration, but a duration cannot be negative."
    );
  }

  durationInSeconds -= seconds;

  return durationFromSeconds(durationInSeconds);
}

/**
 * Check equality for two durations.
 *
 * @param d1 first duration to compare
 * @param d2 second duration to compare
 */
function durationEquals(d1: Duration, d2: Duration): boolean {
  const invalidDuration = findInvalid([d1, d2]);
  if (invalidDuration !== undefined) {
    throw new DurationOperationError(
      "durationEquals",
      [
        { name: "d1", value: JSON.stringify(d1) },
        { name: "d2", value: JSON.stringify(d2) }
      ],
      `Duration ${JSON.stringify(invalidDuration)} is invalid. ${VALID_CONSTRAINT}`
    );
  }

  return (
    d1.hours === d2.hours &&
    d1.minutes === d2.minutes &&
    d1.seconds === d2.seconds
  );
}

/**
 * Check if a duration is considered valid.
 * A duration is considered valid if all values are positive and minutes and seconds are smaller than 60.
 *
 * @param duration to check for validity
 */
function isValid(duration: Duration): boolean {
  return (
    duration.hours >= 0 &&
    duration.minutes >= 0 &&
    duration.seconds >= 0 &&
    duration.minutes < 60 &&
    duration.seconds < 60
  );
}

function findInvalid(durations: Duration[]): Duration | undefined {
  for (let duration of durations) {
    if (!isValid(duration)) {
      return duration;
    }
  }

  return undefined;
}

const hoursFromSeconds = (seconds: number): number =>
  (seconds - (seconds % HOURS_TO_SECONDS)) / HOURS_TO_SECONDS;
const minutesFromSeconds = (seconds: number): number =>
  ((seconds % HOURS_TO_SECONDS) - (seconds % MINUTES_TO_SECONDS)) /
  MINUTES_TO_SECONDS;

/**
 * Error thrown if a duration operation fails.
 */
export class DurationOperationError extends Error {
  constructor(
    operationName: string,
    inputVariables: { name: string; value: string }[],
    reason: string
  ) {
    super(
      `Operation "${operationName}" failed for input [` +
        `${inputVariables.map(({ name, value }) => `{${name}: ${value}}`).join(", ")}` +
        `]: ${reason}`
    );
  }
}
