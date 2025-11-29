import { Dot } from "@/components/atoms/paginationDots";
import { StyleSheet, View } from "react-native";

interface PaginationDotsProps {
  data: any[];
  currentIndex: number;
  activeDotColor?: string;
  inactiveDotColor?: string;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  data,
  currentIndex,
  activeDotColor = "white",
  inactiveDotColor = "#555",
}) => {
  return (
    <View style={styles.container}>
      {data.map((_, i) => (
        <Dot
          key={i}
          isActive={currentIndex === i}
          activeDotColor={activeDotColor}
          inactiveDotColor={inactiveDotColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    height: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
});
