// Play.tsx
import { Devvit, useState } from '@devvit/public-api';
import { Board } from '../../components/board.js';
type PlayProps = {
  context: Devvit.Context;
}
export const Play = ({ context }: PlayProps) => {
  const [key, setKey] = useState(0);

  return (
    <vstack 
      alignment="center middle"
      height="100%"
      width="100%"
    >
      <Board key={key} context={context} />
    </vstack>
  );
};