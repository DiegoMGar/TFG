import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMongoModule } from '../../db/user-mongo/user-mongo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, UserMongoModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
