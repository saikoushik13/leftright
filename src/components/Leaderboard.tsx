import { useAsync, Devvit } from '@devvit/public-api';
import { LeaderboardRow } from './LeaderboardRow.js';
import { Service } from '../services.js';
import { LoadingScreen } from './Loadingscreen.js';

interface LeaderboardPageProps {
    username: string | null;
    onBackToMenu?: () => void;
  }
  export type ScoreBoardEntry = {
    member: string;
    score: number;
    description?: string;
  };

  export const LeaderboardPage = (props: LeaderboardPageProps, context: Devvit.Context): JSX.Element => {
    const service = new Service(context);

    const { data, loading } = useAsync<{
      leaderboard: ScoreBoardEntry[];
      user: {
        rank: number;
        score: number;
      };
    }>(async () => {
      try {
        return {
          leaderboard: await service.getScores(10),
          user: await service.getUserScore(props.username),
        };
      } catch (error) {
        if (error) {
          console.error('Error loading leaderboard data', error);
        }
        return {
          leaderboard: [],
          user: { rank: -1, score: 0 },
        };
      }
    });

    if (loading) {
      if (loading) {
        return <LoadingScreen />;  
      }
    }

    return (
      <zstack width="100%" height="100%" alignment="center top">  {/* Changed to center top */}
        <image
          imageHeight={1080}
          imageWidth={1920}
          height="100%"
          width="100%"
          url="bg3.png"
          description="Leaderboard background"
          resizeMode="cover"
        />
        
        <vstack 
          width="60%" 
          gap="small"  // Changed from medium to small
          backgroundColor="white"
          padding="medium"  // Changed from large to medium
          cornerRadius="large"
          alignment="center top"  // Changed to center top
        >
          <text size="xxlarge" weight="bold" color="black">Leaderboard</text>
          
          {loading ? (
            <text color="white">Loading...</text>
          ) : data && data.leaderboard && data.leaderboard.length > 0 ? (
            <vstack width="100%" gap="small">
              {data.leaderboard.map((entry, index) => (
                <LeaderboardRow
                  rank={index + 1}
                  name={entry.member}
                  score={entry.score}
                />
              ))}
            </vstack>
          ) : (
            <text color="white">No entries found</text>
          )}
          
          {props.username && data && data.user.rank !== -1 && (
            <vstack width="100%" gap="small" padding="small">  {/* Changed padding to small */}
              <text color="black" weight="bold">Your Position:</text>
              <LeaderboardRow
                rank={data.user.rank + 1}
                name={props.username}
                score={data.user.score}
              />
            </vstack>
          )}
          <button
            onPress={props.onBackToMenu}
            appearance="secondary"
            size="medium"
            icon="home"
          >
            Back to Menu
          </button>
        </vstack>
      </zstack>
    );
  };