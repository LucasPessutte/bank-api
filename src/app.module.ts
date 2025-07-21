import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.validation';
import { configLogger } from './config/config.logger';
import { LoggerModule } from 'nestjs-pino';
import { LoggingMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot(configLogger()),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, any>): Record<string, any> => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          throw new Error(JSON.stringify(result.error.format(), null, 2));
        }
        return result.data as Record<string, any>;
      },
    }),
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  /**
   * Configures middleware for the application.
   * @param consumer - The middleware consumer instance used to register middleware
   * @description Applies the LoggingMiddleware to all routes in the application
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
