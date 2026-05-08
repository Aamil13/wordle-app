import React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
};

export default function KeyboardScreenWrapper({
  children,
  contentContainerStyle,
}: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, contentContainerStyle]}
      >
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
