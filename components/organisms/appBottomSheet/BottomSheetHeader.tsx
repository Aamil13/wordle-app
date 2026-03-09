import React from "react";
import { StyleSheet, View } from "react-native";
import { CustomText } from "@/components/atoms/customText";

type Props = {
  title: string;
};

export default function BottomSheetHeader({ title }: Props) {
  return (
    <View style={styles.container}>
      <CustomText size={22}>{title}</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
