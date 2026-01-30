require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './home/app.module';
import { HttpExceptionFilter, configManager } from '@common/config';
import { ConfigKey } from '@common/config/enum';
import { swaggerConfiguration } from '@common/documentation';
import { Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { ApiInterceptor, ValidationException } from '@common/api';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(configManager.getValue(ConfigKey.APP_BASE_URL));
  app.useGlobalFilters(new HttpExceptionFilter());
  swaggerConfiguration.config(app);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => new ValidationException(validationErrors)
  }));
  app.useGlobalInterceptors(new ApiInterceptor());
  await app.listen(parseInt(configManager.getValue(ConfigKey.APP_PORT), 10));
  
};

bootstrap().then(()=>{
  const logger = new Logger('Main Logger');
  logger.log('Server is started !!')
  });
 