import { Devvit, useState } from "@devvit/public-api";
export const LeaderboardRow = (props: { rank: number; name: string; score: number; onPress?: () => void }) => {
    const { rank, name, score, onPress } = props;
  
    return (
      <zstack height="40px" onPress={onPress}>
        <hstack width="100%" height="100%" alignment="start middle">
          <spacer width="12px" />
          <text>{`${rank}.`}</text>
          <spacer width="8px" />
          <text>{name}</text>
        </hstack>
        <hstack width="100%" height="100%" alignment="end middle">
          <text>{score.toLocaleString()}</text>
        </hstack>
      </zstack>
    );
  };
  