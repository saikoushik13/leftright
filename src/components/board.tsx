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

async function saveScoreToRedis(context: Devvit.Context, username: string, score: number) {
  await context.redis.zAdd('game_scores', { member: username, score: score });
  console.log('Score added to Redis successfully!');
}

export const Board = ({ context }: { context: Devvit.Context }) => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [name, setName] = useState(async () => {
    if (!context.userId) return '';
    
    try {
      const storedName = await context.redis.get('username');
      if (storedName) return storedName;
  
      const user = await context.reddit.getUserById(context.userId);
      if (user) {
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
  const [showGameOver, setShowGameOver] = useState(false);

  const timerInterval = useInterval(() => {
    if (gameState.isActive && timer > 0) {
      setTimer((prevTimer) => {
        const newTimer = Math.max(0, prevTimer - 1);
        if (newTimer === 0) {
          setGameState((prev) => ({
            ...prev,
            isActive: false,
          }));
          setShowGameOver(true);
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
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
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

  const handlePlayAgain = () => {
    setScore(0);
    setTimer(30);
    setGameState({
      isActive: true,
      lastUpdate: Date.now(),
    });
    setShowGameOver(false);
    setMessage('');
    setRefreshTrigger((prev) => prev + 1);
  };

  if (showGameOver) {
    return (
      <vstack alignment="center middle" gap="medium" padding="large">
        <text size="xxlarge">Game Over!</text>
        <text size="xlarge">Final Score: {score}</text>
        <button onPress={handlePlayAgain}>
          Play Again
        </button>
      </vstack>
    );
  }

  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image
        imageHeight={1080}
        imageWidth={1920}
        height="100%"
        width="100%"
        url="bg2.png"
        description="Background image"
        resizeMode="cover"
      />
      <vstack alignment="center middle" gap="medium" padding="large" width="100%">
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
      </vstack>
    </zstack>
  );
};