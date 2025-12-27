import { OnboardingButton } from "@/components/molecules/onboarding/onboardingButton";
import { PaginationDots } from "@/components/molecules/onboarding/paginationDots";
import Slide from "@/components/molecules/onboarding/slide";
import { GetOnboardingData } from "@/constants/OnboardingData";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<any>>(null);
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  const OnboardingData = useMemo(
    () => GetOnboardingData(scheme === "dark"),
    [scheme]
  );
  const scrollX = useSharedValue(0);

  const handleScrollJS = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const finish = () => {
    router.replace("/main");
  };

  const next = () => {
    if (index < OnboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  };

  return (
    <View
      style={{ flex: 1, marginTop: insets.top, marginBottom: insets.bottom }}
    >
      <Animated.FlatList
        data={OnboardingData}
        ref={flatListRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleScrollJS}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index: i }) => (
          <Slide item={item} index={i} scrollX={scrollX} />
        )}
      />

      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <PaginationDots data={OnboardingData} currentIndex={index} />

        <OnboardingButton
          onPress={next}
          text={index === OnboardingData.length - 1 ? "Get Started" : "Next"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    bottom: 90,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
});
