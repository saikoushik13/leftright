import { useAsync, Devvit } from '@devvit/public-api';
import { LeaderboardRow } from './LeaderboardRow.js';

type LeaderboardPageProps = {
  username: string;
  context: Devvit.Context;
};

export const LeaderboardPage = ({ username, context }: LeaderboardPageProps) => {
  const { data, loading, error } = useAsync(async () => {
    try {
      // Fetch the top 10 usernames from the sorted set
      const usernames = await context.redis.zRange('game_scores', 0, 9, {
        rev: true // Changed from reverse to rev as per Redis command
      });

      if (!usernames) return { leaderboard: [], user: null };

      // Fetch the scores for the top 10 usernames
      const leaderboard = await Promise.all(
        usernames.map(async (username) => {
          const score = await context.redis.zScore('game_scores', username);
          return { 
            member: username, 
            score: score || 0 // Provide default value if score is null
          };
        })
      );

      // Fetch the current user's score and rank
      const userScore = await context.redis.zScore('game_scores', username);
      let userRank = userScore !== null 
        ? await context.redis.zRank('game_scores', username) 
        : -1;

      return {
        leaderboard: leaderboard.map((entry, index) => ({
          rank: index + 1,
          name: entry.member,
          score: entry.score,
        })),
        user: userScore !== null ? { 
          rank: userRank !== -1 ? userRank + 1 : -1, 
          score: userScore 
        } : null,
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error; // Let useAsync handle the error
    }
  }, [username]); // Add dependency array

  if (loading) {
    return (
      <vstack alignment="center middle">
        <text>Loading leaderboard...</text>
      </vstack>
    );
  }

  if (error || !data) {
    return (
      <vstack alignment="center middle">
        <text>Error loading leaderboard</text>
      </vstack>
    );
  }

  return (
    <vstack alignment="start middle" gap="medium" padding="large">
      <text size="large" weight="bold">Leaderboard</text>
      {data.leaderboard.length > 0 ? (
        <vstack gap="small" width="100%">
          {data.leaderboard.map((row) => (
            <LeaderboardRow
              key={row.name}
              rank={row.rank}
              name={row.name}
              score={row.score}
              onPress={() => {
                try {
                  Devvit.ui.navigateTo(`https://reddit.com/u/${row.name}`);
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
            />
          ))}
        </vstack>
      ) : (
        <text>No scores available.</text>
      )}
      {data.user && data.user.rank > 10 && (
        <LeaderboardRow
          rank={data.user.rank}
          name={username}
          score={data.user.score}
        />
      )}
    </vstack>
  );
};