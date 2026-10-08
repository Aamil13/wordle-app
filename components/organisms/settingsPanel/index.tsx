import { CustomText } from "@/components/atoms/customText";
import SettingRow from "@/components/molecules/settingsRow";
import { saveSettingsToDb } from "@/localDb/settingsService";
import { useAppStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";

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
    keyboardSoundOnPressEnabled,
    toggleKeyboardSoundOnPress,
    theme,
    toggleTheme,
    showOnboarding,
    toggleShowOnboarding,
  } = useAppStore();

  useEffect(() => {
    saveSettingsToDb();
  }, [theme, bgEnabled, hapticsEnabled, keyboardSoundEnabled, keyboardSoundOnPressEnabled, showOnboarding]);
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
        onToggle={() => toggleHaptics()}
      />

      <SettingRow
        title="Keyboard Sound"
        subtitle="Play sound when typing letters"
        value={keyboardSoundEnabled}
        onToggle={togglekeyboardSound}
      />

      <SettingRow
        title="Key Press Sound"
        subtitle="Play sound when pressing keys"
        value={keyboardSoundOnPressEnabled}
        onToggle={toggleKeyboardSoundOnPress}
      />

      <SettingRow
        title="Dark Mode"
        subtitle="Switch between light and dark theme"
        value={theme === "dark"}
        onToggle={toggleTheme}
      />

      <SettingRow
        title="Show Intro on Start"
        subtitle="Show the onboarding screen when the app opens"
        value={showOnboarding}
        onToggle={toggleShowOnboarding}
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
