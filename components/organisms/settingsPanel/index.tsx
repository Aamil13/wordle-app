import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { CustomText } from "@/components/atoms/customText";
import { Ionicons } from "@expo/vector-icons";
import SettingRow from "@/components/molecules/settingsRow";
import { useAppStore } from "@/store";
import { saveSettingsToDb } from "@/localDb/settingsService";

type Props = {
  onClose: () => void;
};

const SettingsPanel = ({ onClose }: Props) => {
  const {
    bgEnabled,
    toggleBg,
    hapticsEnabled,
    toggleHaptics,
    keyboardSoundEnabled,
    togglekeyboardSound,
    theme,
    toggleTheme,
  } = useAppStore();

  useEffect(() => {
    saveSettingsToDb();
  }, [theme, bgEnabled, hapticsEnabled, keyboardSoundEnabled]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CustomText size={18} style={styles.title}>
          SETTINGS
        </CustomText>

        <Pressable onPress={onClose}>
          <Ionicons
            color={theme === "dark" ? "white" : "black"}
            name="close"
            size={24}
          />
        </Pressable>
      </View>

      {/* Options */}
      <SettingRow
        title="BG Music"
        subtitle="Enable background music while playing"
        value={bgEnabled}
        onToggle={() => toggleBg()}
      />

      <SettingRow
        title="Haptics"
        subtitle="Vibration feedback for interactions"
        value={hapticsEnabled}
        onToggle={() => toggleHaptics}
      />

      <SettingRow
        title="Keyboard Sound"
        subtitle="Play sound when typing letters"
        value={keyboardSoundEnabled}
        onToggle={togglekeyboardSound}
      />

      <SettingRow
        title="Dark Mode"
        subtitle="Switch between light and dark theme"
        value={theme === "dark"}
        onToggle={toggleTheme}
        noBorder
      />
    </View>
  );
};

export default SettingsPanel;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    letterSpacing: 1,
  },
});
