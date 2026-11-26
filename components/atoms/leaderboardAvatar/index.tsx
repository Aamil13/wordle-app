import { CustomText } from "@/components/atoms/customText";
import { useTheme } from "@/utils/useTheme";
import { View } from "react-native";

type Props = {
  name: string;
  size: number;
  borderColor?: string;
  isMe?: boolean;
};

const LeaderboardAvatar = ({ name, size, borderColor, isMe }: Props) => {
  const theme = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: isMe ? "#6C63FF" : theme.gray,
        borderWidth: borderColor ? 2.5 : 0,
        borderColor: borderColor ?? "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CustomText size={size * 0.42} color="#fff">
        {name?.[0]?.toUpperCase() ?? "?"}
      </CustomText>
    </View>
  );
};

export default LeaderboardAvatar;
