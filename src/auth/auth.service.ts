// checked
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { PrismaService } from './../prisma/prisma.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: AuthRegisterDto): Promise<any> {
    const { name, username, password, role } = dto;

    try {
      const hashed_password = await argon.hash(password);

      const res = await this.prisma.users.create({
        data: {
          name,
          username,
          hashed_password,
          role,
        },
      });

      delete res.hashed_password;

      return {
        status: HttpStatus.CREATED,
        success: true,
        message: `Registrasi berhasil, silakan login`,
        data: res,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException({
            status: HttpStatus.FORBIDDEN,
            success: false,
            message: `Registrasi gagal`,
            data: {},
          });
        }
      }

      throw error;
    }
  }

  async login(dto: AuthLoginDto): Promise<any> {
    const { username, password } = dto;
    let is_matched = false;

    const res = await this.prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (res) {
      is_matched = await argon.verify(res.hashed_password, password);
    }

    if (!res || !is_matched) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        success: false,
        message: `Username atau password salah`,
        data: {},
      });
    }

    delete res.hashed_password;

    return this.signToken(res);
  }

  async signToken(res: any): Promise<any> {
    try {
      const token = await this.jwt.signAsync(
        { sub: res.id, username: res.username, role: res.role }, //payload
        {
          expiresIn: this.config.get('JWT_EXPIRATION'),
          secret: this.config.get('JWT_SECRET'),
        },
      );

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: `Berhasil login, Selamat datang di Dans Multi Pro REST APIs`,
        data: res,
        access_token: token,
      };
    } catch (error) {
      throw error;
    }
  }
}
