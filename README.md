# SpinWheel React Native Component

A customizable, generic spin wheel component for React Native. Use it to create lucky draw, prize wheel, or gamified reward experiences in your app.

## Features
- Fully customizable rewards and probabilities
- Easy integration with React Native projects
- Configurable appearance and behavior
- Callback when the spin ends

## Installation

```sh
npm install react-native-weighted-fortune
```

## Usage Example

```tsx
import React from 'react';
import { View, Alert } from 'react-native';
import { SpinWheel } from 'react-native-weighted-fortune';

const rewards = [
  '₹100 OFF Dominos',
  '₹100 OFF Zomato',
  '5% OFF Health',
  '₹100 OFF Bus',
  'FREE Health',
  'FREE Gold',
  'FREE Plus',
  '₹100 OFF Pizza',
];

const probabilities = [0, 0, 0, 0, 0, 2, 0, 3];

export default function App() {
  const handleSpinEnd = (reward, index) => {
    Alert.alert('Congratulations!', `You won: ${reward}`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SpinWheel
        rewards={rewards}
        probabilities={probabilities}
        onSpinEnd={handleSpinEnd}
        wheelSize={320} // optional
        buttonText="Spin!" // optional
      />
    </View>
  );
}
```

## Props

| Prop           | Type                       | Required | Default             | Description                                      |
|----------------|----------------------------|----------|---------------------|--------------------------------------------------|
| rewards        | string[]                   | Yes      | -                   | Array of reward labels for each segment          |
| probabilities  | number[]                   | Yes      | -                   | Array of weights for each segment                |
| onSpinEnd      | (reward, index) => void    | No       | -                   | Callback when spin ends, returns reward & index  |
| wheelSize      | number                     | No       | 90% of screen width | Diameter of the wheel in px                      |
| numberOfTurns  | number                     | No       | 4                   | Number of full spins before stopping             |
| buttonText     | string                     | No       | 'Spin the Wheel'    | Text for the spin button                         |
| disabled       | boolean                    | No       | false               | Disable the spin button                          |
| style          | object                     | No       | -                   | Custom styles for container, wheel, button, etc. |

---

MIT License
