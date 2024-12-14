import { Devvit, useState } from "@devvit/public-api";
import { Play } from "../Play/Play.js";

export const PinnedPost = () => {
  const [page, setPage] = useState('menu');
   const Menu=(
    <vstack alignment="center middle" gap="small">
      <button onPress={() => setPage('draw')}>play</button>
      <button>leaderboard</button>
      <button>how to play</button>
     </vstack>
   );

   const onClose = (): void => {
    setPage('menu');
  };

  const pages: Record<string, JSX.Element> = {
    menu: Menu,
    draw: <Play/>,
  };
   return pages[page]||Menu;
};
