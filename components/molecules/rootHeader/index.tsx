import { CustomText } from "@/components/atoms/customText";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

const RootHeader = ({
  onClick,
  headerTextColor,
}: {
  onClick: () => void;
  headerTextColor: string;
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onClick}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Ionicons name="navigate" size={26} color={headerTextColor} />
        <CustomText>Back</CustomText>
      </TouchableOpacity>
    </View>
  );
};
export default RootHeader;
