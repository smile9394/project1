import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { AgreeOfTermsService } from './agree-of-terms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';
import { CreateAgreeOfTermDto } from './dto/create-agree-of-term.dto';

@Controller('agree-of-terms')
export class AgreeOfTermsController {
  constructor(private readonly agreeOfTermsService: AgreeOfTermsService) {}
  @Put()
  @UseGuards(JwtAuthGuard)
  async updateAgreeOfTerm(
    @Req() req: RequestWithUserInterface,
    @Body() updateAgreeOfTermDto: CreateAgreeOfTermDto,
  ) {
    return await this.agreeOfTermsService.updateAgreeOfTerm(
      req.user,
      updateAgreeOfTermDto,
    );
  }
}
