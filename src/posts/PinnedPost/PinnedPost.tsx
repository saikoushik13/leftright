
import { Devvit, useAsync, useState } from "@devvit/public-api";
import { Play } from "../Play/Play.js";
import { LeaderboardPage } from "../../components/Leaderboard.js";

export const PinnedPost = (props: {}, context: Devvit.Context) => {
  const [page, setPage] = useState('menu');
  const [username, setUsername] = useState<string | null>(null);
  useAsync(async () => {
    if (!context.userId) return "";
  
    try {
      const user = await context.reddit.getUserById(context.userId);
      if (user) {
        setUsername(user.username);
        console.log("Username set:", user.username);
      } else {
        console.log("No user found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return "";
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
        size="medium"
        icon="play"
        width="200px"
      >
        Play
      </button>
      
      <button
      onPress={() => setPage('leaderboard')}
        appearance="secondary"
        size="medium"
        width="200px"
      >
        Leaderboard
      </button>
      
      <button
        appearance="bordered"
        size="medium"
        icon="help"
        width="200px"
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
  draw: <Play context={context}  />,
  leaderboard: <LeaderboardPage username={username}/>
};

return pages[page] || Menu;
};
