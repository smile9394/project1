import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  async signinUser(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.userService.createUser(createUserDto);
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
}
