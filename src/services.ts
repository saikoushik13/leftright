import type { RedisClient, Scheduler, ZRangeOptions } from '@devvit/public-api';

export type ScoreBoardEntry = {
    member: string;
    score: number;
    description?: string;
  };
// Service that handles the backbone logic for the application
// This service is responsible for fetching scores and user scores

export class Service {
  readonly redis: RedisClient;
  readonly scheduler?: Scheduler;

  constructor(context: { redis: RedisClient; scheduler?: Scheduler }) {
    this.redis = context.redis;
    this.scheduler = context.scheduler;
  }

  readonly scoresKeyTag: string = 'default';
  readonly scoresKey: string = `pixels:${this.scoresKeyTag}`;

  async getScores(maxLength: number = 10): Promise<ScoreBoardEntry[]> {
    const options: ZRangeOptions = { reverse: true, by: 'rank' };
    return await this.redis.zRange(this.scoresKey, 0, maxLength - 1, options);
  }

  async getUserScore(username: string | null): Promise<{
    rank: number;
    score: number;
  }> {
    const defaultValue = { rank: -1, score: 0 };
    if (!username) return defaultValue;
    try {
      const [rank, score] = await Promise.all([
        this.redis.zRank(this.scoresKey, username),
        this.redis.zScore(this.scoresKey, username),
      ]);
      return {
        rank: rank === undefined ? -1 : rank,
        score: score === undefined ? 0 : score,
      };
    } catch (error) {
      if (error) {
        console.error('Error fetching user score board entry', error);
      }
      return defaultValue;
    }
  }
}
