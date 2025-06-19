import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  async signinUser(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
