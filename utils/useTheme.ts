import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/store";

export const useTheme = () => {
  const theme = useAppStore((state) => state.theme);
  return Colors[theme];
};
