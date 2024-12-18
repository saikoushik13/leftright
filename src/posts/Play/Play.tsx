// Play.tsx
import { Devvit, useState } from '@devvit/public-api';
import { Board } from '../../components/board.js';
import { LoadingScreen } from '../../components/Loadingscreen.js';


type PlayProps = {
  context: Devvit.Context;
};

export const Play = ({ context, onBackToMenu }: { context: Devvit.Context, onBackToMenu: () => void }) => {
  return (
    <vstack 
      alignment="center middle"
      height="100%"
      width="100%"
    >
      <Board context={context} onBackToMenu={onBackToMenu} /> // Remove username prop
    </vstack>
  );
};