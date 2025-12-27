import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

type ButtonVariant = "primary" | "danger" | "success" | "outline" | "default";
type ButtonSize = "small" | "medium" | "large";
type IconPosition = "left" | "right";

interface ButtonProps {
  onPress: () => void;
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  backgroundColor?: string;
  textColor?: string;
  initialRotation?: number;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

export const CustomButton: React.FC<ButtonProps> = ({
  onPress,
  text,
  variant = "default",
  size = "medium",
  backgroundColor,
  textColor,
  initialRotation = 0,
  icon,
  iconPosition = "left",
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(initialRotation);

  // VARIANT STYLES
  const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
    primary: { bg: "#007bff", text: "#fff" },
    danger: { bg: "#ff3b30", text: "#fff" },
    success: { bg: "#28a745", text: "#fff" },
    outline: { bg: "transparent", text: "#000" },
    default: { bg: "white", text: "#000" },
  };

  // SIZE STYLES
  const sizeStyles: Record<
    ButtonSize,
    { paddingV: number; paddingH: number; font: number; iconGap: number }
  > = {
    small: { paddingV: 8, paddingH: 24, font: 14, iconGap: 6 },
    medium: { paddingV: 12, paddingH: 40, font: 18, iconGap: 8 },
    large: { paddingV: 16, paddingH: 50, font: 22, iconGap: 10 },
  };

  const colors = variantStyles[variant];
  const sizeConf = sizeStyles[size];

  const finalBg = backgroundColor ?? colors.bg;
  const finalTextColor = textColor ?? colors.text;

  // ANIMATED STYLE
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  // ANIMATION HANDLERS
  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 5, stiffness: 150, mass: 0.5 });

    rotation.value = withSequence(
      withSpring(initialRotation - 12, { damping: 8, stiffness: 300 }),
      withSpring(initialRotation, { damping: 8, stiffness: 300 })
    );
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.15, { damping: 4, stiffness: 200, mass: 0.3 }),
      withSpring(1, { damping: 6, stiffness: 180, mass: 0.5 })
    );

    rotation.value = withSequence(
      withSpring(initialRotation + 6, { damping: 8, stiffness: 300 }),
      withSpring(initialRotation, { damping: 8, stiffness: 300 })
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            backgroundColor: finalBg,
            paddingVertical: sizeConf.paddingV,
            paddingHorizontal: sizeConf.paddingH,
            borderWidth: variant === "outline" ? 2 : 0,
          },
        ]}
      >
        <View style={[styles.content, { gap: sizeConf.iconGap }]}>
          {icon && iconPosition === "left" && (
            <View style={styles.iconContainer}>{icon}</View>
          )}
          <Text
            style={[
              styles.text,
              {
                color: finalTextColor,
                fontSize: sizeConf.font,
              },
            ]}
          >
            {text}
          </Text>
          {icon && iconPosition === "right" && (
            <View style={styles.iconContainer}>{icon}</View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  button: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "jumpsWinter",
  },
});
