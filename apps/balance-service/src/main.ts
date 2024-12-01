import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { BalanceServiceModule } from './balance-service.module';

import { AllExceptionsFilter } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(BalanceServiceModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
