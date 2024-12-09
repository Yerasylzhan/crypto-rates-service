import { Controller, Post, Get, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PairsService } from './pairs.service';
import { CreatePairDto } from './dto/create-pair.dto';
import { UpdatePairDto } from './dto/update-pair.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('pairs')
@Controller('pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую криптовалютную пару' })
  create(@Body() createPairDto: CreatePairDto) {
    return this.pairsService.create(createPairDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех пар' })
  findAll() {
    return this.pairsService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить параметры пары' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePairDto: UpdatePairDto) {
    return this.pairsService.update(id, updatePairDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пару' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pairsService.delete(id);
  }
}
