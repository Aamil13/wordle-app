import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject } from "react";

export const presentBottomSheet = (
  ref: RefObject<BottomSheetModal | null>,
  snapIndex: number = 0,
  delay: number = 50,
) => {
  if (ref.current) {
    try {
      ref.current.present();

      setTimeout(() => {
        if (ref.current) {
          ref.current.snapToIndex(snapIndex);
        }
      }, delay);
    } catch (error) {
      console.error("Error presenting modal:", error);
    }
  } else {
    console.log("ERROR: Ref is null!");
  }
};
