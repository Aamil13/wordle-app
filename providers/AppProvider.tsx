import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { AudioProvider } from "@/context/audio";
import { NetworkProvider } from "@/context/network";
import { queryClient } from "@/app/_layout";
import NetworkBanner from "@/components/molecules/networkBanner";

type Props = {
  children: ReactNode;
};

export default function AppProviders({ children }: Props) {
  return (
    <NetworkProvider>
      <QueryClientProvider client={queryClient}>
        <AudioProvider>
          <NetworkBanner />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AudioProvider>
      </QueryClientProvider>
    </NetworkProvider>
  );
}
