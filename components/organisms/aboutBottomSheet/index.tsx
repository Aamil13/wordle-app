import { BulletText } from "@/components/atoms/BulletText";
import { CustomText } from "@/components/atoms/customText";
import { Colors } from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AboutBottomSheet = forwardRef<BottomSheetModal>((props, ref) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const defaultColor = Colors[colorScheme || "dark"].background;
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "white" }}
      handleIndicatorStyle={{ backgroundColor: "#ccc" }}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={true}
      android_keyboardInputMode="adjustResize"
      handleComponent={null}
      topInset={insets.top}
      bottomInset={insets.bottom}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        style={[styles.container, { backgroundColor: defaultColor }]}
      >
        <CustomText size={48}>Wordle</CustomText>

        <View style={styles.section}>
          <BulletText size={16}>Unlimited puzzle play</BulletText>
          <BulletText size={16}>Daily challenges</BulletText>
          <BulletText size={16}>Smart hint system</BulletText>
          <BulletText size={16}>Offline-friendly</BulletText>
          <BulletText size={16}>Stats & streaks tracking</BulletText>
        </View>

        {/* <CustomText size={18}>Built with React Native + Expo</CustomText> */}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

AboutBottomSheet.displayName = "AboutBottomSheet";
export default AboutBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 42,
    textAlign: "center",
    color: "#333",
    fontFamily: "jumpsWinter",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
    color: "#555",
    fontFamily: "jumpsWinter",
  },
  section: {
    marginTop: 40,
  },
  bullet: {
    fontSize: 20,
    marginVertical: 4,
    color: "#444",
    fontFamily: "jumpsWinter",
  },
  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontFamily: "jumpsWinter",
  },
});
