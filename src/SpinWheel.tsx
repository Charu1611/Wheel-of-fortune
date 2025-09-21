import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Svg, {
  G,
  Path,
  Circle,
  Text as SvgText,
  TSpan,
  Image as SvgImage,
} from 'react-native-svg';

export interface Slice {
  label: string;
  icon?: any;
  textColor?: string;
  background?: string;
}

export interface SpinWheelProps {
  rewards: Slice[];
  probabilities?: number[];
  onSpinEnd?: (reward: Slice, index: number) => void;
  wheelSize?: number;
  numberOfTurns?: number;
  spinDuration?: number;
  easing?: (value: number) => number;
  buttonText?: string;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  disabled?: boolean;
  pointerStyle?: ViewStyle;
  innerCircleColor?: string;
  outerCircleColor?: string;
  centerCircleRadius?: number;
  imageTextSpacing?: number;
  lineSpacing?: number;
  imageSize?: number;
  imageRadiusFactor?: number;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const weightedRandomChoice = (weights: number[] = []) => {
  if (!weights.length) return Math.floor(Math.random() * weights.length);
  const total = weights.reduce((sum, w) => sum + w, 0);
  const threshold = Math.random() * total;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (threshold < cumulative) return i;
  }
  return weights.length - 1;
};

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
};

const SpinWheel: React.FC<SpinWheelProps> = ({
  rewards,
  probabilities,
  onSpinEnd,
  wheelSize,
  numberOfTurns = 5,
  spinDuration = 5000,
  easing = Easing.out(Easing.cubic),
  buttonText = 'SPIN',
  buttonStyle,
  buttonTextStyle,
  disabled = false,
  pointerStyle,
  innerCircleColor = '#fff',
  outerCircleColor = 'rgba(4,24,57,1)',
  centerCircleRadius = 15,
  imageTextSpacing = 5,
  lineSpacing = 20,
  imageSize = 30,
  imageRadiusFactor = 0.55,
}) => {
  const { width } = Dimensions.get('window');
  const _wheelSize = wheelSize || width * 0.85;
  const CENTER = _wheelSize / 2;
  const OUTER_RADIUS = CENTER;
  const GOLD_RADIUS = OUTER_RADIUS - 4;
  const INNER_RADIUS = OUTER_RADIUS - 8;
  const SEGMENT_RADIUS = OUTER_RADIUS - 14;
  const anglePerSegment = 360 / rewards.length;

  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    if (isSpinning || disabled) return;
    setIsSpinning(true);
    rotateAnimation.setValue(0);

    const targetIndex = weightedRandomChoice(probabilities);
    const targetAngle =
      numberOfTurns * 360 - targetIndex * anglePerSegment - anglePerSegment / 2;

    Animated.timing(rotateAnimation, {
      toValue: targetAngle,
      duration: spinDuration,
      easing,
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      onSpinEnd && onSpinEnd(rewards[targetIndex], targetIndex);
    });
  };

  const interpolatedRotate = rotateAnimation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderSegments = () => {
    let startAngle = 0;
    return rewards.map((slice:any, i:any) => {
      const endAngle = startAngle + anglePerSegment;
      const labelAngle = startAngle + anglePerSegment / 2;

      const path = describeArc(
        CENTER,
        CENTER,
        SEGMENT_RADIUS,
        startAngle,
        endAngle,
      );

      const textPos = polarToCartesian(
        CENTER,
        CENTER,
        SEGMENT_RADIUS * 0.8,
        labelAngle,
      );
      const imagePos = polarToCartesian(
        CENTER,
        CENTER,
        SEGMENT_RADIUS * imageRadiusFactor,
        labelAngle,
      );

      const lines = slice.label.match(/.{1,12}/g) || [];
      startAngle += anglePerSegment;

      return (
        <G key={i}>
          <Path
            d={path}
            fill={slice.background || (i % 2 === 0 ? '#a26cf2' : '#fff')}
            stroke="#222"
            strokeWidth={2}
          />

          {slice.icon && (
            <SvgImage
              href={slice.icon}
              x={imagePos.x - imageSize / 2}
              y={imagePos.y - imageSize / 2}
              width={imageSize}
              height={imageSize}
              transform={`rotate(${labelAngle}, ${imagePos.x}, ${imagePos.y})`}
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          <SvgText
            x={textPos.x}
            y={textPos.y - imageTextSpacing}
            fill={slice.textColor || '#fff'}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            transform={`rotate(${labelAngle}, ${textPos.x}, ${textPos.y})`}
          >
            {lines.map((line, index) => (
              <TSpan
                key={index}
                x={textPos.x}
                dy={index === 0 ? '0' : lineSpacing}
              >
                {line}
              </TSpan>
            ))}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.wheelWrapper}>
          <AnimatedSvg
            width={_wheelSize}
            height={_wheelSize}
            viewBox={`0 0 ${_wheelSize} ${_wheelSize}`}
            style={{ transform: [{ rotate: interpolatedRotate }] }}
          >
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={GOLD_RADIUS}
              fill={outerCircleColor}
            />
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={INNER_RADIUS}
              fill={innerCircleColor}
            />
            <G>{renderSegments()}</G>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={centerCircleRadius}
              fill="#000"
              stroke="#222"
              strokeWidth={2}
            />
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={centerCircleRadius}
              fill="#FFD700"
              stroke="#222"
              strokeWidth={2}
            />
          </AnimatedSvg>
        </View>

        <View style={[styles.notch, pointerStyle]} />
      </View>

      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={spin}
        disabled={isSpinning || disabled}
      >
        <Animated.Text style={[styles.buttonText, buttonTextStyle]}>
          {isSpinning ? 'Spinning...' : buttonText}
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 30 },
  wheelWrapper: { justifyContent: 'center', alignItems: 'center' },
  notch: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    alignSelf: 'center',
    zIndex: 10,
    transform: [{ rotate: '180deg' }],
  },
  button: {
    marginTop: 30,
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 50,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
});

export default SpinWheel;
