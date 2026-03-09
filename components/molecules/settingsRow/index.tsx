import { CustomText } from "@/components/atoms/customText";
import PlayfulSwitch from "@/components/atoms/PlayfulSwitch";
import { useAppStore } from "@/store";
import { StyleSheet, View } from "react-native";

type RowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  noBorder?: boolean;
};

const SettingRow = ({
  title,
  subtitle,
  value,
  onToggle,
  noBorder,
}: RowProps) => {
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled);
  const theme = useAppStore((state) => state.theme);
  return (
    <View style={[styles.row, noBorder && { borderBottomWidth: 0 }]}>
      <View style={styles.textContainer}>
        <CustomText style={styles.rowTitle}>{title}</CustomText>
        <CustomText size={10} style={styles.subtitle}>
          {subtitle}
        </CustomText>
      </View>

      {/*<Switch value={value} onValueChange={onToggle} />*/}
      <PlayfulSwitch
        value={value}
        onValueChange={onToggle}
        enableHaptics={hapticsEnabled}
        theme={theme}
      />
    </View>
  );
};

export default SettingRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },

  textContainer: {
    flex: 1,
    paddingRight: 10,
    gap: 12,
  },

  rowTitle: {
    fontWeight: "600",
  },

  subtitle: {
    marginTop: 2,
  },
});
