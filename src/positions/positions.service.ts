// checked
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from './../prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePositionDto): Promise<any> {
    try {
      const res = await this.prisma.positions.create({ data: dto });

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: `Berhasil menambah data`,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: any): Promise<any> {
    const description = params.description || '';
    const location = params.location || '';
    const full_time = params.full_time || '';

    const page = +params.page || 1;
    const limit = +params.limit || 2;
    const startIndex = (page - 1) * limit;

    let res = [];

    try {
      if (full_time.toLowerCase() === 'true') {
        res = await this.prisma.positions.findMany({
          skip: startIndex,
          take: limit,
          where: {
            description: {
              endsWith: description,
            },
            location: {
              endsWith: location,
            },
            is_full_time: {
              equals: true,
            },
          },
        });
      } else if (full_time.toLowerCase() === 'false') {
        res = await this.prisma.positions.findMany({
          skip: startIndex,
          take: limit,
          where: {
            description: {
              endsWith: description,
            },
            location: {
              endsWith: location,
            },
            is_full_time: {
              equals: false,
            },
          },
        });
      } else {
        res = await this.prisma.positions.findMany({
          skip: startIndex,
          take: limit,
          where: {
            description: {
              endsWith: description,
            },
            location: {
              endsWith: location,
            },
          },
        });
      }

      if (res.length == 0) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: `Tidak ada data`,
          data: {},
        });
      }

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: `Berhasil mendapatkan semua data`,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const res = await this.prisma.positions.findUnique({ where: { id } });

      if (!res) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: `Gagal mendapatkan data id : #${id}, data tidak ditemukan`,
          data: {},
        });
      }

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: `Berhasil mendapatkan data id : #${id}`,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, dto: UpdatePositionDto): Promise<any> {
    try {
      const res = await this.prisma.positions.update({
        where: { id },
        data: dto,
      });

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: `Berhasil mengubah data id : #${id}`,
        data: res,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            success: false,
            message: `Gagal mengubah data id : #${id}, data tidak ditemukan`,
            data: {},
          });
        }
      }
      throw error;
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const res = await this.prisma.positions.delete({ where: { id } });

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: `Berhasil menghapus data id : #${id}`,
        data: res,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            success: false,
            message: `Gagal menghapus data id : #${id}, data tidak ditemukan`,
            data: {},
          });
        }
      }

      throw error;
    }
  }
}
