import { Devvit } from '@devvit/public-api';
type NumberItem = {
  category: 'numbers';
  value: string;
  isOdd: boolean;
}

type WordItem = {
  category: 'words';
  value: string;
  isLiving: boolean;
}

type EmojiItem = {
  category: 'emojis';
  value: string;
  isGoodFeeling: boolean;
}

type GameItem = NumberItem | WordItem | EmojiItem;

type GameState = {
  isActive: boolean; 
  lastUpdate: number;
}
// tile.tsx
type TileProps = {
  isMiddle?: boolean;
  position?: string;
  onTileClick?: (position: string) => void;
  currentItem?: GameItem;  // Update this type
};

export const Tile = ({ isMiddle = false, position = '', onTileClick, currentItem }: TileProps) => {
  return (
    <hstack
      border={'thin'}
      padding={'medium'}
      cornerRadius={'small'}
      width={'80px'}    
      height={'60px'}
      alignment="center middle"
      onPress={() => onTileClick?.(position)}
    >
      <text>{isMiddle && currentItem ? currentItem.value : ''}</text>
    </hstack>
  );
};