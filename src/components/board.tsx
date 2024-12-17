import { useState, useAsync, useInterval, Devvit } from '@devvit/public-api';
import { Tile } from './tile.js';
import { categories } from './categories.js';

type NumberItem = {
  category: 'numbers';
  value: string;
  isOdd: boolean;
};

type WordItem = {
  category: 'words';
  value: string;
  isLiving: boolean;
};

type EmojiItem = {
  category: 'emojis';
  value: string;
  isGoodFeeling: boolean;
};

type GameItem = NumberItem | WordItem | EmojiItem;

type GameState = {
  isActive: boolean;
  lastUpdate: number;
};

// Function to save score to Redis sorted set
async function saveScoreToRedis(context: Devvit.Context, username: string, score: number) {
 
    await context.redis.zAdd('game_scores', { member: name, score:score });
    console.log('Score added to Redis successfully!');
  
}

export const Board = ({ context }: { context: Devvit.Context }) => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [name, setName] = useState(async () => {
    if (!context.userId) return '';
    
    try {
      // First try to get the name from Redis
      const storedName = await context.redis.get('username');
      if (storedName) return storedName;
  
      // If not in Redis, fetch from Reddit API
      const user = await context.reddit.getUserById(context.userId);
      if (user) {
        // Store the username in Redis for future use
        await context.redis.set('username', user.username);
        return user.username;
      }
      return '';
    } catch (error) {
      console.error("Error fetching/setting username:", error);
      return '';
    }
  });
  const [gameState, setGameState] = useState<GameState>({
    isActive: true,
    lastUpdate: Date.now(),
  });
  const [message, setMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const timerInterval = useInterval(() => {
    if (gameState.isActive && timer > 0) {
      setTimer((prevTimer) => {
        const newTimer = Math.max(0, prevTimer - 1);
        if (newTimer === 0) {
          if (name && score > 0) {
            console.log("Score saved",name,score);
            saveScoreToRedis(context, name, score);
          }
          else{
            console.log("Score not saved",name,score);
          }
          setGameState((prev) => ({
            ...prev,
            isActive: false,
          }));
          timerInterval.stop();
        }
        return newTimer;
      });
    }
  }, 1000);

  if (gameState.isActive) {
    timerInterval.start();
  }

  const { data: currentItem } = useAsync<GameItem>(async () => {
    const categoryKeys = Object.keys(categories);
    const randomCategory =
      categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const items = categories[randomCategory as keyof typeof categories];
    const randomItem = items[Math.floor(Math.random() * items.length)];

    return {
      ...randomItem,
      category: randomCategory as 'numbers' | 'words' | 'emojis',
    } as GameItem;
  }, { depends: [refreshTrigger] });

  const handleTileClick = (position: string, setTileColor: (color: string) => void) => {
    if (!gameState.isActive || !currentItem) return;

    let isCorrect = false;

    switch (currentItem.category) {
      case 'numbers':
        const isOdd = parseInt(currentItem.value) % 2 !== 0;
        isCorrect =
          (isOdd && position === 'topLeft') ||
          (!isOdd && position === 'topRight');
        break;
      case 'words':
        isCorrect =
          (currentItem.isLiving && position === 'middleLeft') ||
          (!currentItem.isLiving && position === 'middleRight');
        break;
      case 'emojis':
        isCorrect =
          (currentItem.isGoodFeeling && position === 'bottomLeft') ||
          (!currentItem.isGoodFeeling && position === 'bottomRight');
        break;
    }

    setTileColor(isCorrect ? '#90EE90' : '#FFB6C1');

    if (isCorrect) {
      setScore((prev) => prev + 5);
      setMessage('Correct!');
    } else {
      setTimer((prev) => Math.max(0, prev - 10));
      setMessage('Wrong!');
    }

    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => setMessage(''), 1000);
  };
  console.log("username:", name);

  return (
    <vstack alignment="center middle" gap="medium" padding="large">
      <hstack gap="large">
        <text>Score: {score}</text>
        <text>Time: {timer}s</text>
      </hstack>
      {message && <text>{message}</text>}
      <hstack alignment="center middle" gap="medium">
        <vstack gap="medium">
          <Tile position="topLeft" onTileClick={handleTileClick} />
          <Tile position="middleLeft" onTileClick={handleTileClick} />
          <Tile position="bottomLeft" onTileClick={handleTileClick} />
        </vstack>

        <Tile isMiddle={true} currentItem={currentItem || undefined} />

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