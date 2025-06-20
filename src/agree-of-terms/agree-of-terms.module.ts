import { Module } from '@nestjs/common';
import { AgreeOfTermsService } from './agree-of-terms.service';
import { AgreeOfTermsController } from './agree-of-terms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AgreeOfTerm } from './entities/agree-of-term.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgreeOfTerm]), UserModule],
  controllers: [AgreeOfTermsController],
  providers: [AgreeOfTermsService],
})
export class AgreeOfTermsModule {}
