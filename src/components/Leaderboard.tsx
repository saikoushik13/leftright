import { useAsync, Devvit } from '@devvit/public-api';
import { LeaderboardRow } from './LeaderboardRow.js';
import { Service } from '../services.js';

interface LeaderboardPageProps {
    username: string | null;
    onClose: () => void;
  }
  export type ScoreBoardEntry = {
    member: string;
    score: number;
    description?: string;
  };

export const LeaderboardPage = (props: LeaderboardPageProps, context: Devvit.Context) => {
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
}