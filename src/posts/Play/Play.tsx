// Play.tsx
import { Devvit } from '@devvit/public-api';
import { Board } from '../../components/board.js';


type PlayProps = {
  context: Devvit.Context;
};

export const Play = ({ context }: PlayProps): JSX.Element => {
  return (
    <vstack 
      alignment="center middle"
      height="100%"
      width="100%"
    >
      <Board context={context} /> // Remove username prop
    </vstack>
  );
};