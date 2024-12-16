// Play.tsx
import { Devvit, useState } from '@devvit/public-api';
import { Board } from '../../components/board.js';
type PlayProps = {
  context: Devvit.Context;
  username?: string | null; // Add username prop
};
export const Play = ({ context, username }: PlayProps): JSX.Element => {
  console.log("Play component username:", username);
  return (
    <vstack 
      alignment="center middle"
      height="100%"
      width="100%"
    >
      <Board context={context} username={username ?? null} />
    </vstack>
  );
};