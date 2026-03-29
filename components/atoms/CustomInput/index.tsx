import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { CustomText } from "../customText";
import { useAppStore } from "@/store";
import PasswordStrength from "@/components/molecules/auth/passwordStrengthMeter";

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;

  label?: string;
  showLabel?: boolean;

  error?: string;
  disabled?: boolean;

  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;

  keyboardType?: "default" | "email-address" | "numeric";
  secureTextEntry?: boolean;
  isRounded?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isPasswordStrengthMeterShown?: boolean;
};

const CustomInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,

  label,
  showLabel = true,

  error,
  disabled = false,

  containerStyle,
  inputStyle,

  keyboardType = "default",
  secureTextEntry = false,
  isRounded = false,
  onFocus,
  onBlur,
  isPasswordStrengthMeterShown,
}) => {
  const colorScheme = useAppStore((state) => state.theme);
  const theme = Colors[colorScheme || "dark"];

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;
  const borderColor = error ? theme.error : theme.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {showLabel && label ? (
        <CustomText
          style={[isRounded && { marginLeft: 12 }, { marginBottom: 8 }]}
          size={12}
        >
          {label}
        </CustomText>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: theme.inputBackground,
            opacity: disabled ? 0.6 : 1,
          },
          isRounded ? { borderRadius: 25 } : { borderRadius: 8 },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          editable={!disabled}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !isPasswordVisible}
          style={[styles.input, { color: theme.text }, inputStyle]}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={10}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={22}
              color={theme.placeholder}
            />
          </TouchableOpacity>
        )}
      </View>
      {isPasswordStrengthMeterShown && (
        <PasswordStrength password={value || ""} />
      )}
      {error ? (
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      ) : null}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
