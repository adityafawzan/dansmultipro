// checked
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { RolesGuard } from './../auth/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';
import { Position } from './entities/position.entity';
const config = new ConfigService();

@Controller(config.get('BASE_URL') + 'positions')
@ApiTags('Positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // role based, hanya user dengan role admin yg bisa akses endpoint ini
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: Position })
  create(@Body() dto: CreatePositionDto) {
    return this.positionsService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Position, isArray: true })
  findAll(@Query() params: any) {
    return this.positionsService.findAll(params);
  }

  @Get(':id')
  @ApiOkResponse({ type: Position, isArray: true })
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // role based, hanya user dengan role admin yg bisa akses endpoint ini
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Position })
  update(@Param('id') id: string, @Body() dto: UpdatePositionDto) {
    return this.positionsService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // role based, hanya user dengan role admin yg bisa akses endpoint ini
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Position })
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
