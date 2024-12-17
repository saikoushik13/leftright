// src/components/GameOver.tsx
import { Devvit } from '@devvit/public-api';

type GameOverProps = {
  score: number;
  onPlayAgain: () => void;
};

export const GameOver = ({ score, onPlayAgain }: GameOverProps) => {
  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image
        imageHeight={1080}
        imageWidth={1920}
        height="100%"
        width="100%"
        url="bg2.png"
        description="Game Over background"
        resizeMode="cover"
      />
      
      <vstack alignment="center middle" gap="large">
        <text size="xxlarge" weight="bold" color="white">Game Over!</text>
        <text size="xlarge" color="white">Your Score: {score}</text>
        <button
          onPress={onPlayAgain}
          appearance="primary"
          size="large"
          icon="refresh"
        >
          Play Again
        </button>
      </vstack>
    </zstack>
  );
};