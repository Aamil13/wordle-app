import { CustomText } from "@/components/atoms/customText";
import { memo } from "react";
import { View } from "react-native";

const MainFooter = memo(() => (
  <View style={{ gap: 10, alignItems: "center" }}>
    <CustomText size={12}>Made By: Mohd Aamil Shafi</CustomText>
  </View>
));

MainFooter.displayName = "MainFooter";

export default MainFooter;
