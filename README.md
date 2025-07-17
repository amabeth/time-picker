# Readme

A React Native time picker based
on [@amabeth/repeating-wheel-picker](https://amabeth.github.io/repeating-wheel-picker/).

Offers an inline and a modal time picker.

## Installation

```sh
npm install time-picker
```

## Usage

```tsx
import RepeatingWheelPicker, {
  type RepeatingWheelPickerProps,
} from "time-picker";

// ...
const [, setSelected] = useState<string>();

return (
  <RepeatingWheelPicker<string>
    setSelected={setSelected}
    initialIndex={0}
    data={["first", "second", "third"]}
  />
);
```

## Contributing

Contributions are currently not intended.

## License

[MIT](LICENSE)

## [Changelog](CHANGELOG.md)

## [Impressum / Imprint](https://amabeth.github.io/#imprint)

---
