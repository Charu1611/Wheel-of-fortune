import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

export interface SpinWheelProps {
  rewards: string[];
  probabilities: number[];
  onSpinEnd?: (reward: string, index: number) => void;
  wheelSize?: number;
  numberOfTurns?: number;
  buttonText?: string;
  disabled?: boolean;
  style?: {
    container?: ViewStyle;
    wheelContainer?: ViewStyle;
    wheelWrapper?: ViewStyle;
    pointer?: ViewStyle;
    button?: ViewStyle;
    buttonText?: TextStyle;
  };
}

function weightedRandomChoice(weights: number[]): number {
  const total = weights.reduce((sum, w) => sum + w, 0);
  const threshold = Math.random() * total;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (threshold < cumulative) return i;
  }
  return weights.length - 1;
}

const SpinWheel: React.FC<SpinWheelProps> = ({
  rewards,
  probabilities,
  onSpinEnd,
  wheelSize,
  numberOfTurns = 4,
  buttonText = 'Spin the Wheel',
  disabled = false,
  style = {},
}) => {
  const { width } = Dimensions.get('window');
  const _wheelSize = wheelSize || width * 0.9;
  const numberOfSegments = rewards.length;
  const anglePerSegment = 360 / numberOfSegments;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    if (isSpinning || disabled) return;
    setIsSpinning(true);
    rotateAnimation.setValue(0);
    const targetSegment = weightedRandomChoice(probabilities);
    const segmentCenterAngle = targetSegment * anglePerSegment + anglePerSegment / 2;
    const correctionOffset = 90;
    const targetAngle =
      numberOfTurns * 360 + (360 - segmentCenterAngle - correctionOffset);
    Animated.timing(rotateAnimation, {
      toValue: targetAngle,
      duration: 5000,
      easing: Easing.bezier(0.1, 0.9, 0.2, 1),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      if (onSpinEnd) onSpinEnd(rewards[targetSegment], targetSegment);
    });
  };

  const interpolatedRotate = rotateAnimation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderWheelSegments = () => {
    const radius = _wheelSize / 2;
    const segments = [];
    for (let i = 0; i < numberOfSegments; i++) {
      const startAngle = (i * anglePerSegment * Math.PI) / 180;
      const endAngle = ((i + 1) * anglePerSegment * Math.PI) / 180;
      const x1 = radius + radius * Math.cos(startAngle);
      const y1 = radius + radius * Math.sin(startAngle);
      const x2 = radius + radius * Math.cos(endAngle);
      const y2 = radius + radius * Math.sin(endAngle);
      const largeArc = anglePerSegment > 180 ? 1 : 0;
      const fillColor = i % 2 === 0 ? '#a26cf2' : '#fff';
      segments.push(
        <G key={`segment-${i}`}>
          <Path
            d={`M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
            fill={fillColor}
            stroke="#000"
            strokeWidth={2}
          />
          <SvgText
            x={radius + radius * 0.6 * Math.cos((startAngle + endAngle) / 2)}
            y={radius + radius * 0.6 * Math.sin((startAngle + endAngle) / 2)}
            fill="#000"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            transform={`rotate(${((startAngle + endAngle) / 2) * (180 / Math.PI)}, ${radius + radius * 0.6 * Math.cos((startAngle + endAngle) / 2)}, ${radius + radius * 0.6 * Math.sin((startAngle + endAngle) / 2)})`}
          >
            {rewards[i]}
          </SvgText>
        </G>
      );
    }
    return segments;
  };

  return (
    <View style={[styles.container, style.container]}>
      <View style={[styles.wheelContainer, style.wheelContainer]}>
        <Animated.View
          style={[
            styles.wheelWrapper,
            { width: _wheelSize, height: _wheelSize, borderRadius: _wheelSize / 2 },
            style.wheelWrapper,
            { transform: [{ rotate: interpolatedRotate }] },
          ]}
        >
          <Svg width={_wheelSize} height={_wheelSize} viewBox={`0 0 ${_wheelSize} ${_wheelSize}`}>
            {renderWheelSegments()}
          </Svg>
        </Animated.View>
        <View style={[styles.pointer, style.pointer]} />
      </View>
      <TouchableOpacity
        style={[styles.button, style.button]}
        onPress={spin}
        disabled={isSpinning || disabled}
      >
        <Animated.Text style={[styles.buttonText, style.buttonText]}>{buttonText}</Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  wheelWrapper: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointer: {
    position: 'absolute',
    top: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
    zIndex: 10,
    transform: [{ rotate: '180deg' }],
  },
  button: {
    marginTop: 30,
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SpinWheel; 