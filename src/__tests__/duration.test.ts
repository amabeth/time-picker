import {
  cloneDuration,
  durationEquals,
  durationFromSeconds,
  durationMinusSeconds,
  DurationOperationError,
  durationPlusSeconds,
  durationsDifference,
  durationsSum,
  durationToSeconds,
  durationToString,
  isValid
} from "../services/duration";
import { expect } from "@jest/globals";

expect.addEqualityTesters([durationEquals]);

describe("durationToString", () => {
  test("invalid duration -> error", () => {
    const duration = { hours: 0, minutes: 0, seconds: 61 };

    expect(() => durationToString(duration)).toThrow(DurationOperationError);
  });

  test("include none", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: false, minutes: false, seconds: false };

    expect(durationToString(duration, include)).toBe("");
  });

  test("include hours", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: true, minutes: false, seconds: false };

    expect(durationToString(duration, include)).toBe("10");
  });

  test("include minutes", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: false, minutes: true, seconds: false };

    expect(durationToString(duration, include)).toBe("22");
  });

  test("include seconds", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: false, minutes: false, seconds: true };

    expect(durationToString(duration, include)).toBe("35");
  });

  test("include hours and minutes", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: true, minutes: true, seconds: false };

    expect(durationToString(duration, include)).toBe("10:22");
  });

  test("include hours and seconds", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: true, minutes: false, seconds: true };

    expect(durationToString(duration, include)).toBe("10:35");
  });

  test("include minutes and seconds", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: false, minutes: true, seconds: true };

    expect(durationToString(duration, include)).toBe("22:35");
  });

  test("include all", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: true, minutes: true, seconds: true };

    expect(durationToString(duration, include)).toBe("10:22:35");
  });

  test("include all and add leading zeros", () => {
    const duration = { hours: 1, minutes: 2, seconds: 3 };
    const include = { hours: true, minutes: true, seconds: true };

    expect(durationToString(duration, include)).toBe("01:02:03");
  });

  test("include all with units", () => {
    const duration = { hours: 10, minutes: 22, seconds: 35 };
    const include = { hours: true, minutes: true, seconds: true };
    const units = { hours: "h", minutes: "m", seconds: "s" };

    expect(durationToString(duration, include, units)).toBe("10h:22m:35s");
  });
});

describe("durationToSeconds", () => {
  test("invalid duration -> error", () => {
    const duration = { hours: 0, minutes: 0, seconds: 61 };

    expect(() => durationToSeconds(duration)).toThrow(DurationOperationError);
  });

  test("0 -> 0", () => {
    const duration = { hours: 0, minutes: 0, seconds: 0 };

    expect(durationToSeconds(duration)).toBe(0);
  });

  test("greater than 0 -> seconds match", () => {
    const duration = { hours: 7, minutes: 23, seconds: 30 };

    expect(durationToSeconds(duration)).toBe(26610);
  });
});

describe("durationFromSeconds", () => {
  test("negative seconds", () => {
    const seconds = -2;

    expect(() => durationFromSeconds(seconds)).toThrow(DurationOperationError);
  });

  test("0 -> 0", () => {
    const seconds = 0;

    expect(durationFromSeconds(seconds)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  });

  test("greater than 0 -> duration matches", () => {
    const seconds = 26610;

    expect(durationFromSeconds(seconds)).toEqual({
      hours: 7,
      minutes: 23,
      seconds: 30
    });
  });
});

describe("cloneDuration", () => {
  test("invalid duration -> error", () => {
    const duration = { hours: 0, minutes: 0, seconds: 61 };

    expect(() => cloneDuration(duration)).toThrow(DurationOperationError);
  });

  test("clone successful", () => {
    const duration = { hours: 7, minutes: 23, seconds: 30 };

    const cloned = cloneDuration(duration);
    expect(cloned).not.toBe(duration);
    expect(cloned).toEqual(duration);
  });
});

describe("durationsSum", () => {
  test("includes invalid duration -> error", () => {
    const d1 = { hours: 1, minutes: 0, seconds: 59 };
    const d2 = { hours: 7, minutes: 23, seconds: 30 };

    const invalid = { hours: 0, minutes: 0, seconds: 61 };

    expect(() => durationsSum(d1, invalid, d2)).toThrow(DurationOperationError);
  });

  test("all durations are 0 -> 0", () => {
    const zeroDuration = { hours: 0, minutes: 0, seconds: 0 };

    expect(durationsSum(zeroDuration, zeroDuration, zeroDuration)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  });

  test("duration 1 is 0, duration 2 is greater than zero -> duration 2", () => {
    const d1 = { hours: 0, minutes: 0, seconds: 0 };
    const d2 = { hours: 7, minutes: 23, seconds: 30 };

    expect(durationsSum(d1, d2)).toEqual(d2);
  });

  test("multiple durations greater than 0 -> correctly added", () => {
    const d1 = { hours: 1, minutes: 0, seconds: 59 };
    const d2 = { hours: 7, minutes: 23, seconds: 30 };
    const d3 = { hours: 0, minutes: 0, seconds: 0 };
    const d4 = { hours: 2, minutes: 7, seconds: 15 };

    expect(durationsSum(d1, d2, d3, d4)).toEqual({
      hours: 10,
      minutes: 31,
      seconds: 44
    });
  });
});

describe("durationsDifference", () => {
  test("includes invalid duration -> error", () => {
    const d1 = { hours: 7, minutes: 23, seconds: 30 };
    const d2 = { hours: 1, minutes: 0, seconds: 59 };

    const invalid = { hours: 0, minutes: 0, seconds: 61 };

    expect(() => durationsDifference(d1, invalid, d2)).toThrow(
      DurationOperationError
    );
  });

  test("difference would be negative -> error", () => {
    const d1 = { hours: 7, minutes: 23, seconds: 30 };
    const d2 = { hours: 1, minutes: 0, seconds: 59 };
    const d3 = { hours: 7, minutes: 0, seconds: 59 };

    expect(() => durationsDifference(d1, d2, d3)).toThrow(
      DurationOperationError
    );
  });

  test("all durations are 0 -> 0", () => {
    const zeroDuration = { hours: 0, minutes: 0, seconds: 0 };

    expect(
      durationsDifference(zeroDuration, zeroDuration, zeroDuration)
    ).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });

  test("duration 1 is greater than 0, duration 2 is 0 -> duration 1", () => {
    const d1 = { hours: 7, minutes: 23, seconds: 30 };
    const d2 = { hours: 0, minutes: 0, seconds: 0 };

    expect(durationsDifference(d1, d2)).toEqual(d1);
  });

  test("multiple durations greater than 0 -> correctly added", () => {
    const d1 = { hours: 7, minutes: 23, seconds: 30 };
    const d2 = { hours: 1, minutes: 0, seconds: 59 };
    const d3 = { hours: 0, minutes: 0, seconds: 0 };
    const d4 = { hours: 2, minutes: 7, seconds: 15 };

    expect(durationsDifference(d1, d2, d3, d4)).toEqual({
      hours: 4,
      minutes: 15,
      seconds: 16
    });
  });
});

describe("durationPlusSeconds", () => {
  test("invalid duration -> error", () => {
    const duration = { hours: 0, minutes: 0, seconds: 61 };
    const seconds = 5;

    expect(() => durationPlusSeconds(duration, seconds)).toThrow(
      DurationOperationError
    );
  });

  test("invalid seconds -> error", () => {
    const duration = { hours: 0, minutes: 7, seconds: 23 };
    const seconds = -5;

    expect(() => durationPlusSeconds(duration, seconds)).toThrow(
      DurationOperationError
    );
  });

  test("both 0 -> duration", () => {
    const duration = { hours: 0, minutes: 0, seconds: 0 };
    const seconds = 0;

    expect(durationPlusSeconds(duration, seconds)).toEqual(duration);
  });

  test("both greater than 0 -> correctly added", () => {
    const duration = { hours: 3, minutes: 5, seconds: 11 };
    const seconds = 605;

    expect(durationPlusSeconds(duration, seconds)).toEqual({
      hours: 3,
      minutes: 15,
      seconds: 16
    });
  });
});

describe("durationMinusSeconds", () => {
  test("invalid duration -> error", () => {
    const duration = { hours: 0, minutes: 0, seconds: 61 };
    const seconds = 5;

    expect(() => durationMinusSeconds(duration, seconds)).toThrow(
      DurationOperationError
    );
  });

  test("invalid seconds -> error", () => {
    const duration = { hours: 0, minutes: 7, seconds: 23 };
    const seconds = -5;

    expect(() => durationMinusSeconds(duration, seconds)).toThrow(
      DurationOperationError
    );
  });

  test("seconds larger than duration -> error", () => {
    const duration = { hours: 0, minutes: 0, seconds: 2 };
    const seconds = 5;

    expect(() => durationMinusSeconds(duration, seconds)).toThrow(
      DurationOperationError
    );
  });

  test("both 0 -> duration", () => {
    const duration = { hours: 0, minutes: 0, seconds: 0 };
    const seconds = 0;

    expect(durationMinusSeconds(duration, seconds)).toEqual(duration);
  });

  test("seconds equal to duration -> 0", () => {
    const duration = { hours: 0, minutes: 7, seconds: 23 };
    const seconds = 443;

    expect(durationMinusSeconds(duration, seconds)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  });

  test("seconds smaller than duration -> correctly subtracted", () => {
    const duration = { hours: 3, minutes: 5, seconds: 11 };
    const seconds = 605;

    expect(durationMinusSeconds(duration, seconds)).toEqual({
      hours: 2,
      minutes: 55,
      seconds: 6
    });
  });
});

describe("durationEquals", () => {
  test("invalid duration -> error", () => {
    const d1 = { hours: 0, minutes: 0, seconds: 61 };
    const d2 = { hours: 7, minutes: 23, seconds: 30 };

    expect(() => durationEquals(d1, d2)).toThrow(DurationOperationError);
  });

  test("both 0 -> true", () => {
    const d1 = { hours: 0, minutes: 0, seconds: 0 };
    const d2 = { hours: 0, minutes: 0, seconds: 0 };

    expect(durationEquals(d1, d2)).toBeTruthy();
  });

  test("one 0 -> false", () => {
    const d1 = { hours: 0, minutes: 0, seconds: 0 };
    const d2 = { hours: 7, minutes: 23, seconds: 30 };

    expect(durationEquals(d1, d2)).toBeFalsy();
  });

  test("both greater than 0 and equal -> true", () => {
    const d1 = { hours: 7, minutes: 23, seconds: 30 };
    const d2 = { hours: 7, minutes: 23, seconds: 30 };

    expect(durationEquals(d1, d2)).toBeTruthy();
  });

  test("both greater than 0 and not equal -> false", () => {
    const d1 = { hours: 7, minutes: 23, seconds: 29 };
    const d2 = { hours: 7, minutes: 23, seconds: 30 };

    expect(durationEquals(d1, d2)).toBeFalsy();
  });
});

describe("isValid", () => {
  test("negative -> false", () => {
    const duration = { hours: -1, minutes: 0, seconds: 0 };

    expect(isValid(duration)).toBeFalsy();
  });

  test("seconds too large -> false", () => {
    const duration = { hours: 1, minutes: 5, seconds: 62 };

    expect(isValid(duration)).toBeFalsy();
  });

  test("minutes too large -> false", () => {
    const duration = { hours: 1, minutes: 62, seconds: 5 };

    expect(isValid(duration)).toBeFalsy();
  });

  test("is valid -> true", () => {
    const duration = { hours: 0, minutes: 5, seconds: 59 };

    expect(isValid(duration)).toBeTruthy();
  });
});
