import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from '../interfaces/tokenPayload.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secret = configService.get<string>('ACCESS_TOKEN_SECURITY');
    if (!secret) {
      throw new Error(
        'ACCESS_TOKEN_SECURITY is not defined in environment variables',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: TokenPayloadInterface) {
    return await this.userService.getUserById(payload.userId);
  }
}
