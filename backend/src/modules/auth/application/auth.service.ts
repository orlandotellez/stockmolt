import { IUserRepository } from "@/modules/users/domain/user.repository"
import { FastifyInstance } from "fastify"
import bcrypt from 'bcrypt'
import crypto from 'crypto';
import { env } from "@/config/env"
import { isRedisConnected, redis } from "@/infrastructure/redis";
import { logger } from "@/infrastructure/logger";

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly app: FastifyInstance
  ) { }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }

  private async generateTokens(userId: string, role: string) {
    const accessToken = this.app.jwt.sign(
      { sub: userId, role },
      { expiresIn: env?.JWT_EXPIRES_IN }
    )

    const refreshToken = crypto.randomBytes(40).toString("hex")

    if (isRedisConnected()) {
      const expireTime = 7 * 24 * 60 * 60
      await redis.set(`refresh_token:${refreshToken}`, userId, `EX`, expireTime)
    } else {
      logger.warn("Redis not available - refresh tokens disabled")
    }

    return { accessToken, refreshToken }
  }


}

