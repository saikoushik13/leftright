// src/components/GameOver.tsx
import { Devvit } from '@devvit/public-api';

// src/components/Gameover.tsx
type GameOverProps = {
    score: number;
    onPlayAgain: () => void;
    onBackToMenu: () => void;  // Add this new prop
  };
  
  export const GameOver = ({ score, onPlayAgain, onBackToMenu }: GameOverProps) => {
    return (
      <zstack width="100%" height="100%" alignment="center middle">
        <image
          imageHeight={1080}
          imageWidth={1920}
          height="100%"
          width="100%"
          url="bg3.png"
          description="Game Over background"
          resizeMode="cover"
        />
        
        <vstack alignment="center middle" gap="large">
          <text size="xxlarge" weight="bold" color="white">Game Over!</text>
          <text size="xlarge" color="black">Your Score: {score}</text>
          <hstack gap="medium">
            <button
              onPress={onPlayAgain}
              appearance="primary"
              size="large"
              icon="refresh"
            >
              Play Again
            </button>
            <button
              onPress={onBackToMenu}  // Use the new callback here
              appearance="secondary"
              size="large"
              icon="home"
            >
              Back to Menu
            </button>
          </hstack>
        </vstack>
      </zstack>
    );
  };