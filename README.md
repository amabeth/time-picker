# Readme

A React Native time picker based
on [@amabeth/repeating-wheel-picker](https://amabeth.github.io/repeating-wheel-picker/).

Offers an inline and a modal time picker.

## Installation

```sh
npm install time-picker
```

## Usage

### Inline time picker
```tsx
import {
  InlineTimePicker,
  type InlineTimePickerProps
} from "@amabeth/time-picker";

// ...
const [duration, setDuration] = useState<string>();

return (
  <InlineTimePicker
    duration={duration}
    setDuration={setDuration}
  />
);
```

### Modal time picker
```tsx
import {
  ModalTimePicker,
  type ModalTimePickerProps
} from "@amabeth/time-picker";
import { durationToString } from "./duration";

// ...
const [duration, setDuration] = useState<Duration>({hours: 0, minutes: 0, seconds: 0});
const [showModal, setShowModal] = useState<boolean>(false);

return (
  <View>
    <Text>
      ${durationToString(duration)}
    </Text>
    <Button title={"Change time"} onPress={() => setShowModal(true)}/>

    <ModalTimePicker
      duration={duration}

      visible={showModal}
      setVisible={setShowModal}

      onConfirm={setDuration}
    />
  </View>
);
```

## Example

![](./assets/example-inline.gif) ![](./assets/example-modal-confirm.gif)

![](./assets/example-modal-cancel.gif) ![](./assets/example-modal-tap-out.gif)

## Contributing

Contributions are currently not intended.

## License

[MIT](LICENSE)

## [Changelog](CHANGELOG.md)

## [Impressum / Imprint](https://amabeth.github.io/#imprint)

---
