
import { Devvit, useAsync, useState } from "@devvit/public-api";
import { Play } from "../Play/Play.js";
import { LeaderboardPage } from "../../components/Leaderboard.js";

export const PinnedPost = (props: {}, context: Devvit.Context) => {
  const [page, setPage] = useState('menu');
  const [username, setUsername] = useState<string | null>(null);
  useAsync(async () => {
    if (!context.userId) return "";
  
    const cacheKey = 'cache:userId-username';
    console.log(cacheKey);
    const cache = await context.redis.hGet(cacheKey, context.userId);
    console.log(cache);
    if (cache) {
      setUsername(cache);
    } else {
      const user = await context.reddit.getUserById(context.userId);
      if (user) {
        await context.redis.hSet(cacheKey, { [context.userId]: user.username });
        setUsername(user.username);
        console.log(user.username);
      }
      else{
        console.log("no user");
      }
    }
     return ""
  });
const Menu = (
  <zstack width="100%" height="100%" alignment="center middle">
    {/* Background Image */}
    <image
      imageHeight={1080}
      imageWidth={1920}
      height="100%"
      width="100%"
      url="bg1.png"
      description="Background image"
      resizeMode="cover"
    />
    
    {/* Button Container - adjusted to fit the white space */}
     <vstack 
      alignment="center middle" 
      gap="medium"
      width="33%"  // Center white space width approximation
      height="100%"
    >
      <button 
        onPress={() => setPage('draw')}
        appearance="primary"
        size="large"
        icon="play"
        width="100px"
      >
        Play
      </button>
      
      <button
      onPress={() => setPage('leaderboard')}
        appearance="secondary"
        size="large"
        width="100px"
      >
        Leaderboard
      </button>
      
      <button
        appearance="bordered"
        size="large"
        icon="help"
        width="100px"
      >
        How to Play
      </button>
    </vstack>
  </zstack>
);

const onClose = (): void => {
  setPage('menu');
};


const pages: Record<string, JSX.Element> = {
  menu: Menu,
  draw: <Play context={context} username={username} />,
  leaderboard: <LeaderboardPage username={username}/>
};

return pages[page] || Menu;
};
