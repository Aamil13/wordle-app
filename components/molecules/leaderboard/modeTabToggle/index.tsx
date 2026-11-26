import { CustomText } from "@/components/atoms/customText";
import { useTheme } from "@/utils/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Mode = "daily" | "infinite";

type Props = {
  value: Mode;
  onChange: (mode: Mode) => void;
};

const TABS: { key: Mode; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "infinite", label: "Infinite" },
];

const ModeTabToggle = ({ value, onChange }: Props) => {
  const theme = useTheme();

  return (
    <View style={[styles.tabRow, { backgroundColor: theme.gray + "22" }]}>
      {TABS.map(({ key, label }) => {
        const active = value === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.tab,
              active && {
                backgroundColor: theme.background,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              },
            ]}
            onPress={() => onChange(key)}
            activeOpacity={0.8}
          >
            <CustomText size={14} color={active ? theme.text : theme.gray}>
              {label}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ModeTabToggle;

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});
