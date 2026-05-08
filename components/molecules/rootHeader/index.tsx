import { CustomText } from "@/components/atoms/customText";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const RootHeader = ({
  onClick,
  headerTextColor,
  title = "Back",
}: {
  onClick: () => void;
  headerTextColor: string;
  title: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Ionicons name="chevron-back" size={26} color={headerTextColor} />
      <CustomText style={{ color: headerTextColor }}>{title}</CustomText>
    </TouchableOpacity>
  );
};
export default RootHeader;
