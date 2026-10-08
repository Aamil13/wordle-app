import NetworkBanner from "@/components/molecules/networkBanner";
import { AudioProvider } from "@/context/audio";
import { NetworkProvider } from "@/context/network";
import { queryClient } from "@/lib/queryClient";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = {
  children: ReactNode;
  headerBgColor: string;
};

export default function AppProviders({ children, headerBgColor }: Props) {
  return (
    <NetworkProvider>
      <QueryClientProvider client={queryClient}>
        <AudioProvider>
          <NetworkBanner />
          <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: headerBgColor }}
          >
            <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AudioProvider>
      </QueryClientProvider>
    </NetworkProvider>
  );
}
