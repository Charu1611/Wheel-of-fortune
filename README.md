# SpinWheel React Native Component

A **fully customizable, weighted spin wheel component** for React Native. Perfect for creating lucky draws, prize wheels, or gamified reward experiences in your app. Supports icons, colors, probabilities, text, and advanced styling.

![Demo GIF](https://github.com/Charu1611/Wheel-of-fortune/blob/main/assets/wheel.gif)

---

## Features

- Weighted random selection for fair spins  
- Supports icons, labels, and custom text colors per segment  
- Fully customizable wheel size, colors, and number of turns  
- Configurable spin duration and easing  
- Adjustable icon size and position relative to the wheel center  
- Customizable spin button, pointer, and text spacing  
- Callback when the spin ends  
- Ready for React Native projects

---

## Installation

```sh
npm install react-native-weighted-fortune


```

```tsx
import React from 'react';
import { View, Alert } from 'react-native';
import SpinWheel, { Slice } from 'react-native-weighted-fortune';

const rewards: Slice[] = [
  { label: '₹100 OFF Dominos', background: '#f44336' },
  { label: '₹100 OFF Zomato', background: '#ff9800' },
  { label: '5% OFF Health', background: '#4caf50' },
  { label: '₹100 OFF Bus', background: '#2196f3' },
  { label: 'FREE Health', background: '#9c27b0' },
  { label: 'FREE Gold', background: '#ffeb3b', textColor: '#000' },
  { label: 'FREE Plus', background: '#00bcd4' },
  { label: '₹100 OFF Pizza', background: '#e91e63' },
];

const probabilities = [0, 0, 0, 0, 0, 2, 0, 3];

export default function App() {
  const handleSpinEnd = (reward: Slice, index: number) => {
    Alert.alert('Congratulations!', `You won: ${reward.label}`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SpinWheel
        rewards={rewards}
        probabilities={probabilities}
        onSpinEnd={handleSpinEnd}
        wheelSize={320} // optional
        numberOfTurns={5} // optional
        spinDuration={6000} // optional
        buttonText="Spin Now!" // optional
        innerCircleColor="#fff" // optional
        outerCircleColor="#041839" // optional
        centerCircleRadius={20} // optional
        buttonStyle={{ backgroundColor: '#FF6B6B' }} // optional
        buttonTextStyle={{ color: '#fff', fontWeight: 'bold' }} // optional
        pointerStyle={{ borderBottomColor: '#000' }} // optional
        imageSize={40} // optional: size of icons
        imageRadiusFactor={0.6} // optional: distance of icon from center (0-1)
        imageTextSpacing={8} // optional: space between icon and text
        lineSpacing={18} // optional: spacing between text lines
      />
    </View>
  );
}

```

## Props

| Prop               | Type                        | Required | Default                    | Description                                                                           |
| ------------------ | --------------------------- | -------- | -------------------------- | ------------------------------------------------------------------------------------- |
| rewards            | `Slice[]`                   | Yes      | -                          | Array of reward objects with `label`, optional `icon`, `textColor`, and `background`. |
| probabilities      | `number[]`                  | No       | Equal probability          | Array of weights for each segment.                                                    |
| onSpinEnd          | `(reward, index) => void`   | No       | -                          | Callback fired when spin ends, returns the selected reward & index.                   |
| wheelSize          | `number`                    | No       | 85% of screen width        | Diameter of the wheel in pixels.                                                      |
| numberOfTurns      | `number`                    | No       | 5                          | Number of full spins before stopping.                                                 |
| spinDuration       | `number`                    | No       | 5000                       | Duration of spin animation in milliseconds.                                           |
| easing             | `(value: number) => number` | No       | `Easing.out(Easing.cubic)` | Easing function for the spin animation.                                               |
| buttonText         | `string`                    | No       | 'SPIN'                     | Text displayed on the spin button.                                                    |
| disabled           | `boolean`                   | No       | false                      | Disable the spin button.                                                              |
| buttonStyle        | `ViewStyle`                 | No       | -                          | Custom styles for the spin button.                                                    |
| buttonTextStyle    | `TextStyle`                 | No       | -                          | Custom styles for the button text.                                                    |
| pointerStyle       | `ViewStyle`                 | No       | -                          | Custom styles for the pointer/notch.                                                  |
| innerCircleColor   | `string`                    | No       | '#fff'                     | Color of the inner circle.                                                            |
| outerCircleColor   | `string`                    | No       | 'rgba(4,24,57,1)'          | Color of the outer wheel.                                                             |
| centerCircleRadius | `number`                    | No       | 15                         | Radius of the center circle.                                                          |
| imageSize          | `number`                    | No       | 30                         | Size of the icon displayed in each segment.                                           |
| imageRadiusFactor  | `number`                    | No       | 0.55                       | Relative distance of icon from center (0 = center, 1 = edge).                         |
| imageTextSpacing   | `number`                    | No       | 5                          | Vertical spacing between icon and text label.                                         |
| lineSpacing        | `number`                    | No       | 20                         | Vertical spacing between multiple lines of text.                                      |
                                                    |

---

MIT License
