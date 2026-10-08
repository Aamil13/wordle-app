import { CustomText } from "@/components/atoms/customText";
import PlayfulSwitch from "@/components/atoms/PlayfulSwitch";

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


  const handleToggle = async () => {

    onToggle();
  };

  return (
    <View style={[styles.row, noBorder && { borderBottomWidth: 0 }]}>
      <View style={styles.textContainer}>
        <CustomText style={styles.rowTitle} align="left">{title}</CustomText>
        <CustomText align="left" size={10} style={styles.subtitle}>
          {subtitle}
        </CustomText>
      </View>

      <PlayfulSwitch
        value={value}
        onValueChange={handleToggle}
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
