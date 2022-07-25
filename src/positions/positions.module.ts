// checked
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PositionsController } from './positions.controller';
import { PrismaService } from './../prisma/prisma.service';
import { PositionsService } from './positions.service';

@Module({
  controllers: [PositionsController],
  providers: [ConfigService, PrismaService, PositionsService],
})
export class PositionsModule {}
