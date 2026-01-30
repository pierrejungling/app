import { Module } from '@nestjs/common';
import { AccountController } from './controller/account/account.controller';

@Module({
  controllers: [AccountController]
})
export class AccountModule {}
