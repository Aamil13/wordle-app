import { AnimationObject } from "lottie-react-native";

export interface OnboardingDataTypes {
  animation: AnimationObject;
  id: number;
  text: string;
  textColor: string;
  bgColor: string;
  description: string;
  descriptionColor: string;
}

export const GetOnboardingData = (isDark: boolean) => {
  const colors = {
    bg: isDark ? "#211f1fff" : "#FFF8F0",
    primary: isDark ? "#FF8AAE" : "#FF6F91",
    secondary: isDark ? "#715d33ff" : "#ebc47cff",
    tertiary: isDark ? "#463d94ff" : "#6A5CF6",
    text: isDark ? "#FFFFFF" : "#ffffffff",
    primaryDescription: isDark ? "#c8babaff" : "#555555",
    description: isDark ? "#c8babaff" : "#fffcfcff",
  };

  return [
    {
      id: 1,
      animation: require("../assets/onboarding/W.json"),
      text: "Welcome to Wordle",
      textColor: colors.primary,
      bgColor: colors.bg,
      description: "A simple, fun & addictive word puzzle game.",
      descriptionColor: colors.primaryDescription,
    },
    {
      id: 2,
      animation: require("../assets/onboarding/SquareBox.json"),
      text: "Build Your Vocabulary",
      textColor: colors.text,
      bgColor: colors.secondary,
      description: "Get ready to guess words and sharpen your skills.",
      descriptionColor: colors.description,
    },
    {
      id: 3,
      animation: require("../assets/onboarding/PartyDance.json"),
      text: "Celebrate Your Wins!",
      textColor: colors.text,
      bgColor: colors.tertiary,
      description: "Solve the puzzle and enjoy victory animations.",
      descriptionColor: colors.description,
    },
  ];
};
