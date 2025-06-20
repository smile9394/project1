import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    //의존성 주입
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  // accessToken 생성하는 메서드 -> 다른페이지 가도 로그인 유지
  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECURITY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }
}
