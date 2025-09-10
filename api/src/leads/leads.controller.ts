import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadStageDto, UpdateLeadTagsDto } from './dto/lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('stageId') stageId?: string,
    @Query('tagIds') tagIds?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    const filters: any = {};
    
    if (search) filters.search = search;
    if (stageId) filters.stageId = stageId;
    if (tagIds) filters.tagIds = tagIds.split(',');
    if (campaignId) filters.campaignId = campaignId;

    return this.leadsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Patch(':id/stage')
  @UseGuards(ApiKeyGuard)
  updateStage(
    @Param('id') id: string,
    @Body() updateStageDto: UpdateLeadStageDto,
  ) {
    return this.leadsService.updateStage(id, updateStageDto);
  }

  @Patch(':id/tags')
  @UseGuards(ApiKeyGuard)
  updateTags(
    @Param('id') id: string,
    @Body() updateTagsDto: UpdateLeadTagsDto,
  ) {
    return this.leadsService.updateTags(id, updateTagsDto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }
}
