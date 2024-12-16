import { useState, useAsync, useInterval,Devvit } from '@devvit/public-api';
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
  try {
    // Add the score to a sorted set with the username as the member
    await context.redis.zAdd('game_scores', { member: username, score });
    console.log('Score added to Redis successfully!');
  } catch (error) {
    console.error('Failed to add score to Redis:', error);
  }
}

export const Board = ({ context, username }: { context: Devvit.Context, username: string | null }) => {
  console.log("Board component username:", username);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
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

    setTileColor(isCorrect ? '#90EE90' : '#FFB6C1'); // Green for correct, red for wrong

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

  useAsync(async () => {
    if (!gameState.isActive && username) {
      console.log('Saving score for user:', username);
      await saveScoreToRedis(context, username, score);
      return { saved: true }; // Return a JSONValue
    }
    else{
      console.log(username);
    }
    return { saved: false }; // Return a JSONValue for when conditions aren't met
  }, { depends: [gameState.isActive, username, score] });

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
