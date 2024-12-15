import { Devvit, useState } from '@devvit/public-api';
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
  onTileClick?: (position: string, setColor: (color: string) => void) => void;
  currentItem?: GameItem;
};
export const Tile = ({ isMiddle = false, position = '', onTileClick, currentItem }: TileProps) => {
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  const handleClick = () => {
    if (onTileClick) {
      // Pass the setBackgroundColor function to parent
      onTileClick(position, setBackgroundColor);
    }
  };

  return (
    <hstack
    border={'thin'}
    padding={'medium'}
    cornerRadius={'medium'} // Make it more button-like
    width={'80px'}    
    height={'60px'}
    alignment="center middle"
    backgroundColor={backgroundColor}
    onPress={handleClick}
    borderColor={'secondary'} // Add border color for button effect
  >
    <text>{isMiddle && currentItem ? currentItem.value : ''}</text>
  </hstack>
  );
};