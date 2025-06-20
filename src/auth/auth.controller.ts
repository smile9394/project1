import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUserInterface } from './interfaces/requestWithUser.interface';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailUserDto } from '../user/dto/email-user.dto';
import { VerifyEmailDto } from '../user/dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('/signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signupUser(createUserDto);
  }

  // 로그인
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async loginUser(@Req() req: RequestWithUserInterface) {
    const user = await req.user;
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    return { user, accessToken, refreshToken };
  }
  // 로그인한 유저 정보 확인
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfoByToken(@Req() req: RequestWithUserInterface) {
    return req.user;
  }

  // 가입 완료 이메일 전송
  @Post('/email/send')
  @ApiBody({ type: EmailUserDto })
  async sendEmail(@Body() emailUserDto: EmailUserDto) {
    return await this.authService.sendEmail(emailUserDto);
  }

  // 인증코드 비교
  @Post('/email/verify')
  async verifyEmailWithCode(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }
}

//controller 에 앤드포인트를 만들어놓고 서비스를 구현
