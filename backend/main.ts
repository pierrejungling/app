import {NestFactory} from '@nestjs/core';
import {AppModule} from './src/home/app.module';
import {ConfigKey, configManager, HttpExceptionFilter} from '@common/config';
import {swaggerConfiguration} from '@common/documentation';
import {Logger, ValidationPipe} from '@nestjs/common';
import { ApiInterceptor, ValidationException } from '@common/api';
import { ValidationError } from 'class-validator';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(configManager.getValue(ConfigKey.APP_BASE_URL));
  swaggerConfiguration.config(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => new ValidationException(validationErrors)
    }));

  app.useGlobalInterceptors(new ApiInterceptor());
  await app.listen(parseInt(configManager.getValue(ConfigKey.APP_PORT), 10));
}

bootstrap().then(()=>{
  const logger = new Logger('Main Logger');
  logger.log('Server is started !!')
}); 