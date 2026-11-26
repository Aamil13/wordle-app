import ModeTabToggle from "@/components/molecules/leaderboard/modeTabToggle";
import LeaderboardList from "@/components/organisms/leaderboardList";
import { useGetLeaderboard } from "@/services/leaderboard/hooks";
import { useAppStore } from "@/store";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useState } from "react";


type Mode = "daily" | "infinite";

const Leaderboard = () => {
  const currentUser = useAppStore((s) => s.user);
  const [mode, setMode] = useState<Mode>("daily");

  const { data, isFetching, isError } = useGetLeaderboard({ mode });
  const rows = data?.leaderboard ?? [];

  // const isFetching = false;
  // const isError = false;
  // const rows = Array.from({ length: 30 }, (_, i) => ({
  //   rank: i + 1,
  //   userId: `user-${i + 1}`,
  //   userName: `Player ${i + 1}`,
  //   avatar: null,
  //   score: Math.max(10, 1000 - i * 30 + Math.floor(Math.random() * 15)),
  // }));

  return (
    <SafeAreaWrapper style={{ paddingLeft: 0, paddingRight: 0 }}>
      {/* Header */}
     

      <ModeTabToggle value={mode} onChange={setMode} />

      <LeaderboardList
        rows={rows}
        currentUserId={currentUser?.id}
        isFetching={isFetching}
        isError={isError}
      />
    </SafeAreaWrapper>
  );
};

export default Leaderboard;


