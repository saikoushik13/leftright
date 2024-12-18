// src/components/HowToPlay.tsx
import { Devvit } from '@devvit/public-api';

type HowToPlayProps = {
  onBackToMenu: () => void;
};

export const HowToPlay = ({ onBackToMenu }: HowToPlayProps) => {
  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image
        imageHeight={1080}
        imageWidth={1920}
        height="100%"
        width="100%"
        url="bg3.png"
        description="How to Play background"
        resizeMode="cover"
      />
      
      <vstack 
        width="60%" 
        gap="medium" 
        backgroundColor="white"
        padding="large"
        cornerRadius="large"
        alignment="center middle"
      >
        <text size="xxlarge" weight="bold" color="black">How to Play</text>
        
        <vstack gap="medium" padding="medium">
          <text size="large" weight="bold" color="black">Game Rules:</text>
          
          <vstack gap="small">
          <text color="black"></text>
          <text color="black">Top row</text>
  <text color="black">1. Numbers: Click Left (Odd) or Right (Even)</text>
  <text color="black">Middle row</text>
  <text color="black">2. Words: Click Left (Living) or Right (Non-Living)</text>
  <text color="black">Bottom row</text>
  <text color="black">3. Emojis: Click Left (Good) or Right (Bad) Feelings</text>
</vstack>
          <vstack gap="small">
            <text color="black">• You have 30 seconds to play</text>
            <text color="black">• Each correct answer gives you 5 points</text>
            <text color="black">• Wrong answers reduce time by 2 seconds</text>
            <text color="black">• Try to get the highest score!</text>
          </vstack>
        </vstack>
        
        <button
          onPress={onBackToMenu}
          appearance="primary"
          size="large"
          icon="home"
        >
          Back to Menu
        </button>
      </vstack>
    </zstack>
  );
};