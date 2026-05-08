import { CustomText } from "@/components/atoms/customText";
import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/store";
import { View, StyleSheet } from "react-native";

export default function PasswordStrength({ password }: { password: string }) {
  const colorScheme = useAppStore((state) => state.theme);
  const colors = Colors[colorScheme || "dark"];

  const checks = {
    length: password.length > 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strength <= 1) return "Weak";
    if (strength === 2 || strength === 3) return "Medium";
    return "Strong";
  };

  const getBarColor = (level: number) => {
    if (level > strength) return colors.border;

    if (strength <= 1) return colors.error; // red
    if (strength <= 3) return colors.yellow; // yellow
    return colors.green; // green
  };

  return (
    <View>
      {/* Bars */}
      <View style={styles.container}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              {
                backgroundColor: getBarColor(level),
              },
            ]}
          />
        ))}
      </View>

      {/* Strength Label */}
      <CustomText size={12} style={styles.label}>
        Strength: {getStrengthLabel()}
      </CustomText>

      {/* Helper Text */}
      <View style={styles.helperContainer}>
        <CustomText
          fontFamily="IoSevca"
          size={14}
          color={checks.length ? colors.green : colors.text}
        >
          • At least 8 characters
        </CustomText>
        <CustomText
          fontFamily="IoSevca"
          size={14}
          color={checks.uppercase ? colors.green : colors.text}
        >
          • One uppercase letter
        </CustomText>
        <CustomText
          fontFamily="IoSevca"
          size={14}
          color={checks.number ? colors.green : colors.text}
        >
          • One number
        </CustomText>
        <CustomText
          fontFamily="IoSevca"
          size={14}
          color={checks.special ? colors.green : colors.text}
        >
          • One special character
        </CustomText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    width: "98%",
    marginTop: 8,
    marginLeft: 4,
  },

  bar: {
    height: 4,
    flex: 1,
    borderRadius: 4,
  },

  label: {
    marginTop: 12,
    marginLeft: 4,
  },

  helperContainer: {
    marginTop: 6,
    marginLeft: 4,
  },

  helperText: {
    fontSize: 12,
    marginBottom: 2,
  },
});
