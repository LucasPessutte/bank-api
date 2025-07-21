import { join } from 'node:path';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { configAppEnv } from './config/config.app.env';
import { configCors } from './config/config.cors';
export type Teste = 'teste';

/**
 * Bootstrap function to initialize and configure the NestJS application.
 *
 * This function:
 * 1. Creates a new NestJS application instance with buffer logging enabled
 * 2. Initializes the application
 * 3. Retrieves the configuration service to get the port number
 * 4. Sets up a logger for bootstrap operations
 * 5. Configures Swagger documentation
 * 6. Configures environment settings
 * 7. Sets up CORS protection
 * 8. Implements Helmet security middleware
 * 9. Starts the HTTP server on the specified port
 *
 * @returns {Promise<void>} A promise that resolves when the application has started
 */
async function bootstrap(): Promise<void> {
  console.time('Application Startup Time');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useBodyParser('json', { limit: '10mb' });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const baseUrl = configService.get<string>('BASE_URL') || '0.0.0.0';

  const logger = new Logger('Bootstrap');

  app.useLogger(logger);

  app.use('/docs-static', (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    console.log(`Authorization Header: ${authHeader}`);

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.set('WWW-Authenticate', 'Basic realm="Documentation"');
      return res.status(401).send('Authentication required');
    }

    const [, base64Credentials] = authHeader.split(' ');
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );

    const [username, password] = credentials.split(':');

    console.log(`Username: ${username}, Password: ${password}`);

    if (
      username === process.env.DOCS_USER &&
      password === process.env.DOCS_PASSWORD
    ) {
      next();
    } else {
      res.set('WWW-Authenticate', 'Basic realm="Documentation"');
      res.status(401).send('Invalid credentials');
    }
  });

  // Servir documentação estática após autenticação
  app.useStaticAssets(join(__dirname, '..', 'docs'), {
    prefix: '/docs-static/',
  });
  configAppEnv();

  configCors(app);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  await app.listen(port, baseUrl, () => {
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(
      `API documentation available at: http://localhost:${port}/api-docs`,
    );
    console.timeEnd('Application Startup Time');
    console.log(`Application Started In ${process.uptime()} seconds`);
  });
}

console.time('Start Console.Time');
console.timeEnd('Start Console.Time');
void bootstrap();
