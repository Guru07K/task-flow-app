import mongoose from "mongoose";
import { RedisCacheVersion } from "../../schema/redis-cache-version.schema";
import redisClient from "./redis";

const DEFAULT_TTL = 300;
const DEFAULT_VERSION = 1;

class CacheService {
  async set<T>(key: string, value: T, ttlSeconds: number = DEFAULT_TTL): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
      });
    } catch (error) {
      console.error("Redis SET error:", error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);

      if (value === null) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Redis GET error:", error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error("Redis DELETE error:", error);
    }
  }

  async getRedisVersionFromMongo(resource: string): Promise<number> {
    const rediCacheVersion = await RedisCacheVersion.findOne({ resource });
    if (!rediCacheVersion) {
      throw new Error(`Cache version not initialized: ${resource}`);
    }

    return rediCacheVersion.version;
  }

  async initializeRedisVersionInMongo(resource: string): Promise<void> {
    await RedisCacheVersion.updateOne(
      { resource },
      {
        $setOnInsert: {
          version: DEFAULT_VERSION,
        },
      },
      { upsert: true },
    );
  }

  // async getVersion(versionKey: string): Promise<number | null> {
  //   try {
  //     const value = await redisClient.get(versionKey);

  //     if (value !== null) {
  //       const version = Number(value);

  //       if (!Number.isSafeInteger(version) || version < 1) {
  //         throw new Error(`Invalid Redis cache version: ${versionKey}`);
  //       }

  //       return version;
  //     }

  //     await redisClient.set(versionKey, String(DEFAULT_VERSION), {
  //       NX: true,
  //     });

  //     const currentVersion = await redisClient.get(versionKey);

  //     if (currentVersion === null) return null;

  //     const version = Number(currentVersion);

  //     if (!Number.isSafeInteger(version) || version < 1) {
  //       throw new Error(`Invalid Redis cache version: ${versionKey}`);
  //     }

  //     return version;
  //   } catch (error) {
  //     console.error("Redis GET VERSION error:", error);
  //     return null;
  //   }
  // }

  async incrementRedisVersionInMongo(resource: string, session: mongoose.ClientSession): Promise<number> {
    const redisCacheVersion = await RedisCacheVersion.findOneAndUpdate(
      { resource },
      {
        $inc: {
          version: 1,
        },
      },
      { returnDocument: "after", session },
    );
    if (!redisCacheVersion) {
      throw new Error(`Cache version not initialized: ${resource}`);
    }

    return redisCacheVersion.version;
  }

  // async incrementVersion(versionKey: string): Promise<number | null> {
  //   try {
  //     await redisClient.set(versionKey, String(DEFAULT_VERSION), {
  //       NX: true,
  //     });
  //     // console.error("Redis INCREMENT VERSION :");
  //     return await redisClient.incr(versionKey);
  //   } catch (error) {
  //     console.error("Redis INCREMENT VERSION error:", error);
  //     return null;
  //   }
  // }

  /**
   buildVersionedKey("project", 1, "id:123")
   Result: project:v1:id:123
   */
  buildVersionedKey(prefix: string, version: number, key: string): string {
    return `${prefix}:v${version}:${key}`;
  }
}

const redisCacheService = new CacheService();
export default redisCacheService;
