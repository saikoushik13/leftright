import { Devvit, useState } from "@devvit/public-api";
export const LeaderboardRow = (props: { rank: number; name: string; score: number; onPress?: () => void }) => {
  const { rank, name, score, onPress } = props;

  return (
    <zstack 
      height="50px" 
      onPress={onPress}
      backgroundColor="white"
      cornerRadius="medium"
    >
      <hstack width="100%" height="100%" alignment="start middle" padding="medium">
        <text color="black" weight="bold">{`${rank}.`}</text>
        <spacer width="12px" />
        <text color="black">{name}</text>
        <spacer grow />
        <text color="black" weight="bold">{score.toLocaleString()}</text>
      </hstack>
    </zstack>
  );
};
  