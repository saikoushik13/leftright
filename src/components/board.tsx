import { Devvit } from '@devvit/public-api';
import { Tile } from './tile.js';

export const Board = () => {
  return (
           <vstack alignment="center middle" gap="medium" padding="large">
               <hstack alignment="center middle" gap="medium">
                 <vstack gap="medium">
                   {/* Left side tiles */}
                   <Tile />
                   <Tile />
                   <Tile />
                 </vstack>
                 
                 {/* Center tile */}
                 <Tile />
                 
                 <vstack gap="medium">
                   {/* Right side tiles */}
                   <Tile />
                   <Tile />
                   <Tile />
                 </vstack>
               </hstack>
             </vstack>
  );
};