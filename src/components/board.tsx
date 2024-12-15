import { Devvit, useState, useAsync } from '@devvit/public-api';
import { Tile } from './tile.js';
import { categories } from './categories.js';

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

export const Board = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameState, setGameState] = useState<GameState>({
    isActive: true,
    lastUpdate: Date.now()
  });
  const [message, setMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: currentItem } = useAsync<GameItem>(async () => {
    const categoryKeys = Object.keys(categories);
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const items = categories[randomCategory as keyof typeof categories];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    return {
      ...randomItem,
      category: randomCategory as 'numbers' | 'words' | 'emojis'
    } as GameItem;
  }, { depends: [refreshTrigger] });

  const { data: timerData } = useAsync(async () => {
    if (!gameState.isActive) return timer;

    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastUpdate) / 1000;

    if (deltaTime >= 1) {
      const newTimer = Math.max(0, timer - 1);
      setTimer(newTimer);
      setGameState(prev => ({
        ...prev,
        lastUpdate: currentTime
      }));

      if (newTimer === 0) {
        setGameState(prev => ({
          ...prev,
          isActive: false
        }));
      }
    }

    return timer;
  }, { depends: [gameState.lastUpdate] });

  const handleTileClick = (position: string) => {
    if (!gameState.isActive || !currentItem) return;

    let isCorrect = false;

    switch (currentItem.category) {
      case 'numbers':
        const isOdd = parseInt(currentItem.value) % 2 !== 0;
        isCorrect = (isOdd && position === 'topLeft') || (!isOdd && position === 'topRight');
        break;
      case 'words':
        isCorrect = (currentItem.isLiving && position === 'middleLeft') || 
                   (!currentItem.isLiving && position === 'middleRight');
        break;
      case 'emojis':
        isCorrect = (currentItem.isGoodFeeling && position === 'bottomLeft') || 
                   (!currentItem.isGoodFeeling && position === 'bottomRight');
        break;
    }

    if (isCorrect) {
      setScore(prev => prev + 5);
      setMessage('Correct!');
    } else {
      setTimer(prev => Math.max(0, prev - 10));
      setMessage('Wrong!');
    }

    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => setMessage(''), 1000);
  };

  const renderInstructions = () => {
    return (
      <vstack gap="small" padding="small">
        <text>Instructions:</text>
        <text>Numbers: Odd → Top Left, Even → Top Right</text>
        <text>Words: Living → Middle Left, Non-living → Middle Right</text>
        <text>Emojis: Happy → Bottom Left, Sad → Bottom Right</text>
      </vstack>
    );
  };

  return (
    <vstack alignment="center middle" gap="medium" padding="large">
      {renderInstructions()}
      <hstack gap="large">
        <text>Score: {score}</text>
        <text>Time: {timerData}s</text>
      </hstack>
      {message && <text>{message}</text>}
      <hstack alignment="center middle" gap="medium">
        <vstack gap="medium">
          <Tile position="topLeft" onTileClick={handleTileClick} />
          <Tile position="middleLeft" onTileClick={handleTileClick} />
          <Tile position="bottomLeft" onTileClick={handleTileClick} />
        </vstack>
        
        <Tile isMiddle={true} currentItem={currentItem||undefined} />
        
        <vstack gap="medium">
          <Tile position="topRight" onTileClick={handleTileClick} />
          <Tile position="middleRight" onTileClick={handleTileClick} />
          <Tile position="bottomRight" onTileClick={handleTileClick} />
        </vstack>
      </hstack>
      {!gameState.isActive && (
        <vstack gap="medium" alignment="center middle">
          <text>Game Over!</text>
          <text>Final Score: {score}</text>
        </vstack>
      )}
    </vstack>
  );
};