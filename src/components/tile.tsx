import { Devvit, useState } from '@devvit/public-api';

// Define the categories
const categories = {
  numbers: Array.from({length: 10}, (_, i) => (i + 1).toString()),
  words: ['Rock', 'Chair', 'Car', 'Building', 'Clock', 'Cat', 'Tree', 'Bird', 'Human', 'Fish'],
  emojis: ['😊', '🤩', '😎', '🥳', '❤️', '😢', '😡', '😓', '😱', '💔']
};

type TileProps = {
  isMiddle?: boolean;
};

export const Tile = ({ isMiddle = false }: TileProps) => {
  const [content, setContent] = useState('');

  const getRandomItem = () => {
    if (!isMiddle) return;
    
    // Randomly select a category
    const categoryKeys = Object.keys(categories);
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    
    // Get random item from selected category
    const items = categories[randomCategory as keyof typeof categories];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    setContent(randomItem);
  };

  return (
    <hstack
      border={'thin'}
      padding={'medium'}
      cornerRadius={'small'}
      width={'80px'}    
      height={'60px'}
      alignment="center middle"
      onPress={getRandomItem}
    >
      <text>{content}</text>
    </hstack>
  );
};