
import { Devvit, useState } from "@devvit/public-api";
import { Play } from "../Play/Play.js";
import { LeaderboardPage } from "../../components/Leaderboard.js";
;
export const PinnedPost = (props: {}, context: Devvit.Context) => {
  const [page, setPage] = useState('menu');
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
  draw: <Play context={context} />,
  leaderboard: <LeaderboardPage />
};

return pages[page] || Menu;
};
