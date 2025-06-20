import { Module } from '@nestjs/common';
import { AgreeOfTermsService } from './agree-of-terms.service';
import { AgreeOfTermsController } from './agree-of-terms.controller';

@Module({
  controllers: [AgreeOfTermsController],
  providers: [AgreeOfTermsService],
})
export class AgreeOfTermsModule {}
