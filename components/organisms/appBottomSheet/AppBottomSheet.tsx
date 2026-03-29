import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import BottomSheetHeader from "./BottomSheetHeader";
import { useAppStore } from "@/store";

type Props = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  title?: string;
  scrollable?: boolean;
  showHandle?: boolean;
  contentContainerStyle?: ViewStyle;
};

const AppBottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    {
      children,
      snapPoints = ["50%", "85%"],
      title,
      scrollable = true,
      showHandle = true,
      contentContainerStyle,
    },
    ref,
  ) => {
    const colorScheme = useAppStore((state) => state.theme);
    const insets = useSafeAreaInsets();

    const theme = Colors[colorScheme || "dark"];

    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

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
      [],
    );

    const Container = scrollable ? BottomSheetScrollView : BottomSheetView;

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={memoizedSnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: theme.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.text + "40",
        }}
        handleComponent={showHandle ? undefined : null}
        topInset={insets.top}
        bottomInset={insets.bottom}
        android_keyboardInputMode="adjustResize"
      >
        {title && <BottomSheetHeader title={title} />}

        <Container
          style={styles.container}
          contentContainerStyle={[
            styles.contentContainer,
            contentContainerStyle,
          ]}
        >
          {children}
        </Container>
      </BottomSheetModal>
    );
  },
);

AppBottomSheet.displayName = "AppBottomSheet";

export default AppBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
