// src/components/LoadingScreen.tsx
import { Devvit } from '@devvit/public-api';

export const LoadingScreen = () => {
  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image
        imageHeight={1080}
        imageWidth={1920}
        height="100%"
        width="100%"
        url="bg3.png"
        description="Loading background"
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
        <text size="xxlarge" weight="bold" color="black">Loading...</text>
        <text size="large" color="black">Please wait while we set things up!</text>
        
        {/* Add a simple animation effect */}
        <hstack gap="small">
          <text size="xlarge" color="primary">•</text>
          <text size="xlarge" color="secondary">•</text>
          <text size="xlarge" color="primary">•</text>
        </hstack>
      </vstack>
    </zstack>
  );
};