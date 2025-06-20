import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { EmailUserDto } from '../user/dto/email-user.dto';
import { VerifyEmailDto } from '../user/dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    //의존성 주입
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원가입
  async signupUser(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.userService.createUser(createUserDto);
      await this.emailService.sendMail({
        to: createUserDto.email,
        subject: 'welcome Sungwoo Blog',
        text: 'welcome to Sungwoo Blog',
      });
      return createdUser;
    } catch (error) {
      console.log(error);
      if (error?.code === '23505') {
        throw new HttpException(
          'user with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // 로그인
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    const isPasswordMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException('password do not match', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  // 이메일 전송하는 로직
  async sendEmail(emailUserDto: EmailUserDto) {
    const generateNumber = this.generateOTP();

    // 번호 저장
    await this.cacheManager.set(emailUserDto.email, generateNumber);
    await this.emailService.sendMail({
      to: emailUserDto.email,
      subject: '성우서비스 - 이메일 인증,',
      text: `성우서비스 가입 인증 메일입니다. ${generateNumber}를 입력해주세요.`,
    });
  }

  // 이메일 인증하는 로직
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const emailCodeByRedis = await this.cacheManager.get(verifyEmailDto.email);
    if (emailCodeByRedis !== verifyEmailDto.code) {
      throw new BadRequestException('Code is wrong');
    }
    await this.cacheManager.del(verifyEmailDto.email);
    return true;
  }

  // accessToken 생성하는 메서드 -> 다른페이지 가도 로그인 유지
  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECURITY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return accessToken;
  }

  // refreshToken 생성하는 함수
  public generateRefreshToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECURITY'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    return refreshToken;
  }
  // 6자리 OTP 생성하는 함수
  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
