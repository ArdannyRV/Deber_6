import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import styled from 'styled-components/native';
import { theme } from '@/presentation/theme/theme';

const { width, height } = Dimensions.get('window');

interface Props {
  children: React.ReactNode;
}

export function AnimatedBackground({ children }: Props) {
  const orb1X = useRef(new Animated.Value(0)).current;
  const orb1Y = useRef(new Animated.Value(0)).current;
  const orb1S = useRef(new Animated.Value(1)).current;
  const orb2X = useRef(new Animated.Value(0)).current;
  const orb2Y = useRef(new Animated.Value(0)).current;
  const orb2S = useRef(new Animated.Value(1)).current;
  const orb3X = useRef(new Animated.Value(0)).current;
  const orb3Y = useRef(new Animated.Value(0)).current;
  const orb3S = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const seq = (
      x: Animated.Value,
      y: Animated.Value,
      s: Animated.Value,
      moves: { x: number; y: number; s: number; dur: number }[],
    ) =>
      Animated.loop(
        Animated.sequence(
          moves.map((m) =>
            Animated.parallel([
              Animated.timing(x, { toValue: m.x, duration: m.dur, useNativeDriver: true }),
              Animated.timing(y, { toValue: m.y, duration: m.dur, useNativeDriver: true }),
              Animated.timing(s, { toValue: m.s, duration: m.dur, useNativeDriver: true }),
            ]),
          ),
        ),
      );

    const l1 = seq(orb1X, orb1Y, orb1S, [
      { x: 60, y: 40, s: 1.2, dur: 5000 },
      { x: -30, y: -50, s: 0.85, dur: 4200 },
      { x: -50, y: 30, s: 1.1, dur: 4800 },
      { x: 30, y: -20, s: 0.9, dur: 4500 },
      { x: 0, y: 0, s: 1, dur: 5500 },
    ]);
    const l2 = seq(orb2X, orb2Y, orb2S, [
      { x: -50, y: -30, s: 0.9, dur: 5500 },
      { x: 40, y: 30, s: 1.15, dur: 4800 },
      { x: -20, y: 50, s: 0.95, dur: 5000 },
      { x: 60, y: -20, s: 1.1, dur: 4200 },
      { x: 0, y: 0, s: 1, dur: 6000 },
    ]);
    const l3 = seq(orb3X, orb3Y, orb3S, [
      { x: 30, y: -40, s: 1.1, dur: 4000 },
      { x: -40, y: 30, s: 0.9, dur: 3600 },
      { x: 60, y: 40, s: 1.15, dur: 4500 },
      { x: -30, y: -20, s: 0.9, dur: 3800 },
      { x: 0, y: 0, s: 1, dur: 5000 },
    ]);

    l1.start();
    l2.start();
    l3.start();

    return () => { l1.stop(); l2.stop(); l3.stop(); };
  }, []);

  return (
    <Container>
      <DeepGradient colors={['#EFF6FF', '#F8FAFC', '#F0F5FF']} />
      <OrbBase
        style={{
          width: 300, height: 300, borderRadius: 150,
          top: height * -0.05, left: -80,
          transform: [{ translateX: orb1X }, { translateY: orb1Y }, { scale: orb1S }],
        }}
      >
        <OrbGradient colors={['#BFDBFE', '#93C5FD']} />
      </OrbBase>
      <OrbBase
        style={{
          width: 220, height: 220, borderRadius: 110,
          top: height * 0.5, left: width * 0.6,
          transform: [{ translateX: orb2X }, { translateY: orb2Y }, { scale: orb2S }],
        }}
      >
        <OrbGradient colors={['#DDD6FE', '#C4B5FD']} />
      </OrbBase>
      <OrbBase
        style={{
          width: 180, height: 180, borderRadius: 90,
          top: height * 0.72, left: width * 0.05,
          transform: [{ translateX: orb3X }, { translateY: orb3Y }, { scale: orb3S }],
        }}
      >
        <OrbGradient colors={['#FDE68A', '#FCD34D']} />
      </OrbBase>
      <StyledBlur intensity={35} tint="light" />
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.backgroundBase};
`;

const DeepGradient = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const OrbBase = styled(Animated.View)`
  position: absolute;
  overflow: hidden;
`;

const OrbGradient = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  width: 100%;
  height: 100%;
`;

const StyledBlur = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Content = styled.View`
  flex: 1;
`;
