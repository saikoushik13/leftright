import { useAsync, Devvit } from '@devvit/public-api';
import { LeaderboardRow } from './LeaderboardRow.js';
import { Service } from '../services.js';

interface LeaderboardPageProps {
    username: string | null;
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
      return <text>Loading...</text>;
    }

    return (
      <vstack width="100%" gap="medium">
        <text size="large">Leaderboard</text>
      
        {/* Add null check before mapping */}
        {data && data.leaderboard && data.leaderboard.length > 0 ? (
          data.leaderboard.map((entry, index) => (
            <LeaderboardRow
            rank={index + 1}
            name={entry.member}
            score={entry.score}
          />
          ))
        ) : (
          <text>No entries found</text>
        )}
      
        {props.username && data && data.user.rank !== -1 && (
          <vstack>
            <text>Your Position:</text>
            <LeaderboardRow
              rank={data.user.rank + 1}
              name={props.username}
              score={data.user.score}
            />
          </vstack>
        )}
      </vstack>
    );
  };