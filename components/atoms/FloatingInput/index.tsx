import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { CustomText } from "../customText";
import CustomInput from "../CustomInput";

type Props = React.ComponentProps<typeof CustomInput> & {
  label: string;
  isPasswordStrengthMeterShown?: boolean;
  error?: string;
};

export default function FloatingInput({
  label,
  value,
  onChangeText,
  isPasswordStrengthMeterShown = false,
  error,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  const labelY = useSharedValue(value ? -22 : 0);
  const labelX = useSharedValue(value ? -4 : 0);
  const labelScale = useSharedValue(value ? 0.9 : 1);

  useEffect(() => {
    const shouldFloat = focused || !!value;

    labelY.value = withTiming(shouldFloat ? -26 : 0, { duration: 200 });
    labelX.value = withTiming(shouldFloat ? -12 : 0, { duration: 200 });
    labelScale.value = withTiming(shouldFloat ? 0.9 : 1, { duration: 200 });
  }, [focused, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: labelX.value },
      { translateY: labelY.value },
      { scale: labelScale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.label, animatedStyle]}>
        <CustomText size={12}>{label}</CustomText>
      </Animated.View>

      <CustomInput
        {...props}
        showLabel={false}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        isPasswordStrengthMeterShown={isPasswordStrengthMeterShown}
        error={error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  label: {
    position: "absolute",
    left: 14,
    top: 14,
    zIndex: 10,
  },
});
