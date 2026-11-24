import { CustomText } from "@/components/atoms/customText";
import { useGetLeaderboard } from "@/services/leaderboard/hooks";
import { LeaderboardRow } from "@/services/leaderboard/types";
import { useAppStore } from "@/store";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useTheme } from "@/utils/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Mode = "daily" | "infinite";

// Medal / podium constants
const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"] as const;
const PODIUM_HEIGHTS = [80, 60, 50] as const; // 1st, 2nd, 3rd

// ─── Avatar ──────────────────────────────────────────────────────────────────
const Avatar = ({
  name,
  size,
  borderColor,
  isMe,
}: {
  name: string;
  size: number;
  borderColor?: string;
  isMe?: boolean;
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isMe ? "#6C63FF" : theme.gray,
          borderWidth: borderColor ? 2.5 : 0,
          borderColor: borderColor ?? "transparent",
        },
      ]}
    >
      <CustomText size={size * 0.42} color="#fff">
        {name?.[0]?.toUpperCase() ?? "?"}
      </CustomText>
    </View>
  );
};

// ─── Podium (top-3 display) ──────────────────────────────────────────────────
const Podium = ({
  top3,
  currentUserId,
}: {
  top3: LeaderboardRow[];
  currentUserId?: string;
}) => {
  const theme = useTheme();
  // Render order: 2nd | 1st | 3rd
  const displayOrder = [top3[1], top3[0], top3[2]].filter(
    (p): p is LeaderboardRow => Boolean(p)
  );

  return (
    <View style={styles.podiumWrapper}>
      {displayOrder.map((player) => {
        const rank = player.rank; // 1, 2, or 3
        const isFirst = rank === 1;
        const podiumH = PODIUM_HEIGHTS[rank - 1] ?? 50;
        const medalColor = MEDAL_COLORS[rank - 1];
        const isMe = player.userId === currentUserId;

        return (
          <View key={player.userId} style={styles.podiumColumn}>
            {isFirst && (
              <CustomText size={22} style={styles.crown}>
                👑
              </CustomText>
            )}
            <Avatar
              name={player.userName}
              size={isFirst ? 62 : 52}
              borderColor={medalColor}
              isMe={isMe}
            />
            <CustomText
              size={12}
              color={isMe ? "#6C63FF" : theme.text}
              style={styles.podiumName}
            >
              {isMe ? "You" : `@${player.userName}`}
            </CustomText>
            <CustomText
              size={11}
              color={theme.gray}
              style={{ marginBottom: 4 }}
            >
              {player.score} pts
            </CustomText>
            <View
              style={[
                styles.podiumBlock,
                { height: podiumH, backgroundColor: medalColor },
              ]}
            >
              <CustomText size={isFirst ? 28 : 22} color="#fff">
                {rank}
              </CustomText>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// ─── List row ─────────────────────────────────────────────────────────────────
const ListRow = ({
  item,
  isMe,
}: {
  item: LeaderboardRow;
  isMe: boolean;
}) => {
  const theme = useTheme();
  const rank = item.rank;
  const medalColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : undefined;

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isMe
            ? "rgba(108,99,255,0.12)"
            : theme.inputBackground,
          borderColor: isMe ? "#6C63FF" : theme.border,
        },
      ]}
    >
      {/* Rank / trophy */}
      <View style={styles.rankCell}>
        {medalColor ? (
          <Ionicons name="trophy" size={18} color={medalColor} />
        ) : (
          <CustomText size={14} color={theme.gray}>
            {rank}
          </CustomText>
        )}
      </View>

      {/* Avatar */}
      <Avatar name={item.userName} size={40} isMe={isMe} />

      {/* Name & handle */}
      <View style={styles.nameCell}>
        <CustomText
          size={15}
          align="left"
          color={isMe ? "#6C63FF" : theme.text}
        >
          {isMe ? "You" : item.userName}
        </CustomText>
        <CustomText size={12} align="left" color={theme.gray}>
          @{item.userName}
        </CustomText>
      </View>

      {/* Score */}
      <CustomText size={15} color={isMe ? "#6C63FF" : theme.text}>
        {item.score} pts
      </CustomText>
    </View>
  );
};

// ─── Separator ───────────────────────────────────────────────────────────────
const Separator = () => <View style={{ height: 8 }} />;

// ─── Main screen ─────────────────────────────────────────────────────────────
const Leaderboard = () => {
  const theme = useTheme();
  const router = useRouter();
  const currentUser = useAppStore((s) => s.user);
  const [mode, setMode] = useState<Mode>("daily");

  const { data, isFetching, isError } = useGetLeaderboard({ mode });

  const rows = data?.leaderboard ?? [];
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <SafeAreaWrapper style={{ paddingLeft: 0, paddingRight: 0 }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>

        <View>
          <CustomText size={20}>Leaderboard</CustomText>
          {data?.date ? (
            <CustomText size={12} color={theme.gray}>
              {mode === "daily" ? data.date : "All time"}
            </CustomText>
          ) : null}
        </View>

        {/* Spacer to balance back button */}
        <View style={styles.headerBtn} />
      </View>

      {/* Mode tab toggle */}
      <View
        style={[styles.tabRow, { backgroundColor: theme.gray + "22" }]}
      >
        {(["daily", "infinite"] as Mode[]).map((m) => {
          const active = mode === m;
          return (
            <TouchableOpacity
              key={m}
              style={[
                styles.tab,
                active && {
                  backgroundColor: theme.background,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                },
              ]}
              onPress={() => setMode(m)}
              activeOpacity={0.8}
            >
              <CustomText
                size={14}
                color={active ? theme.text : theme.gray}
              >
                {m === "daily" ? "Daily" : "Infinite"}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Body */}
      {isFetching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.spinner} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={40}
            color={theme.gray}
          />
          <CustomText size={15} color={theme.gray} style={{ marginTop: 8 }}>
            Failed to load leaderboard
          </CustomText>
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={44} color={theme.gray} />
          <CustomText size={15} color={theme.gray} style={{ marginTop: 8 }}>
            No data yet
          </CustomText>
        </View>
      ) : (
        /**
         * FlashList v2 — no estimatedItemSize needed.
         * contentContainerStyle only accepts the keys defined in ContentStyle
         * (backgroundColor, padding*, paddingHorizontal, etc.).
         */
        <FlashList
          data={rest}
          renderItem={({ item }) => (
            <ListRow item={item} isMe={item.userId === currentUser?.id} />
          )}
          keyExtractor={(item) => item.userId}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            top3.length > 0 ? (
              <Podium top3={top3} currentUserId={currentUser?.id} />
            ) : null
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaWrapper>
  );
};

export default Leaderboard;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    width: 36,
    alignItems: "center",
  },

  // Tab toggle
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  // Podium
  podiumWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 10,
  },
  podiumColumn: {
    alignItems: "center",
    flex: 1,
  },
  crown: {
    marginBottom: 2,
  },
  podiumName: {
    marginTop: 6,
    marginBottom: 2,
  },
  podiumBlock: {
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  rankCell: {
    width: 28,
    alignItems: "center",
  },
  nameCell: {
    flex: 1,
    gap: 2,
  },

  // Avatar
  avatar: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Loading / error / empty
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
