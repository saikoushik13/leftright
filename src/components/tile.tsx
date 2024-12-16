import { useState,Devvit,useInterval } from '@devvit/public-api';

type GameItem = {
  category: string;
  value: string;
  isOdd?: boolean;
  isLiving?: boolean;
  isGoodFeeling?: boolean;
};

type TileProps = {
  isMiddle?: boolean;
  position?: string;
  onTileClick?: (position: string, setTileColor: (color: string) => void) => void;
  currentItem?: GameItem;
};
export const Tile = ({ isMiddle = false, position = '', onTileClick, currentItem }: TileProps) => {
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const updateInterval = useInterval(() => {
    setBackgroundColor('transparent');
  }, 1000);
  const handleClick = () => {
    if (onTileClick) {
      onTileClick(position, (color: string) => {
        setBackgroundColor(color);
        updateInterval.start();
      });
    }
  };

  return (
    <hstack
      border={'thin'}
      padding={'medium'}
      cornerRadius={'medium'}
      width={'80px'}
      height={'60px'}
      alignment="center middle"
      backgroundColor={backgroundColor}
      onPress={handleClick}
      borderColor={'secondary'}
    >
      <text>{isMiddle && currentItem ? currentItem.value : ''}</text>
    </hstack>
  );
};
