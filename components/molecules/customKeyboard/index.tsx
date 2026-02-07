import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo, useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type OnScreenKeyboardProps = {
  onKeyPressed: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export const ENTER = "ENTER";
export const BACKSPACE = "BACKSPACE";

// const keys = [
//   ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
//   ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
//   [ENTER, "z", "x", "c", "v", "b", "n", "m", BACKSPACE],
// ];

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", BACKSPACE],
];

// Cartoonish color palette
const THEME_COLORS = {
  light: {
    keyBg: "#f0f0f0",
    green: "#6adb8f",
    yellow: "#ffd85a",
    gray: "#9e9e9e",
    text: "#2c3e50",
    textOnColor: "#ffffff",
  },
  dark: {
    keyBg: "#3a3a3c",
    green: "#538d4e",
    yellow: "#b59f3b",
    gray: "#565759",
    text: "#ffffff",
    textOnColor: "#ffffff",
  },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const KeyButton = memo(function KeyButton({
  keyItem,
  keyWidth,
  keyHeight,
  isSpecial,
  bgColor,
  textColor,
  onKeyPressed,
}: {
  keyItem: string;
  keyWidth: number;
  keyHeight: number;
  isSpecial: boolean;
  bgColor: string;
  textColor: string;
  onKeyPressed: (key: string) => void;
}) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
    rotation.value = withSpring(Math.random() > 0.5 ? 2 : -2, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    rotation.value = withSpring(0, { damping: 12, stiffness: 200 });
  };

  return (
    <AnimatedTouchable
      onPress={() => onKeyPressed(keyItem)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      style={[
        styles.key,
        {
          width: isSpecial ? keyWidth * 2.5 : keyWidth,
          height: keyHeight,
          backgroundColor: bgColor,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={[
          styles.keyText,
          { color: textColor },
          keyItem === "ENTER" && { fontSize: 12 },
        ]}
      >
        {keyItem === ENTER ? (
          "ENTER"
        ) : keyItem === BACKSPACE ? (
          <Ionicons name="backspace-outline" size={28} color={textColor} />
        ) : (
          keyItem.toUpperCase()
        )}
      </Text>
    </AnimatedTouchable>
  );
});

const OnScreenKeyboard = ({
  onKeyPressed,
  greenLetters,
  yellowLetters,
  grayLetters,
}: OnScreenKeyboardProps) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  const keyWidth = Platform.OS === "web" ? 58 : (width - 60) / keys[0].length;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => key === ENTER || key === BACKSPACE;

  // Memoize color lookups
  const keyColors = useMemo(() => {
    const colors: Record<string, { bg: string; text: string }> = {};

    keys.flat().forEach((key) => {
      const lowerKey = key.toLowerCase();
      let bgColor = theme.keyBg;
      let textColor = theme.text;

      if (greenLetters.includes(lowerKey)) {
        bgColor = theme.green;
        textColor = theme.textOnColor;
      } else if (yellowLetters.includes(lowerKey)) {
        bgColor = theme.yellow;
        textColor = theme.textOnColor;
      } else if (grayLetters.includes(lowerKey)) {
        bgColor = theme.gray;
        textColor = theme.textOnColor;
      }

      colors[key] = { bg: bgColor, text: textColor };
    });

    return colors;
  }, [greenLetters, yellowLetters, grayLetters, theme]);

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key) => (
            <KeyButton
              key={`key-${key}`}
              keyItem={key}
              keyWidth={keyWidth}
              keyHeight={keyHeight}
              isSpecial={isSpecialKey(key)}
              bgColor={keyColors[key].bg}
              textColor={keyColors[key].text}
              onKeyPressed={onKeyPressed}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default OnScreenKeyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 6,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  keyText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
