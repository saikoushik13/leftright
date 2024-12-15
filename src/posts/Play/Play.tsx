import { Devvit } from '@devvit/public-api';
import { Tile } from '../../components/tile.js';
import { Board } from '../../components/board.js';

export const Play = () => {
  return (
    <vstack 
    alignment="center middle"
    height="100%"
    width="100%"
  >
    <Board />
  </vstack>
  );
};