import { IsOptional, IsUUID, IsArray } from 'class-validator';

export class UpdateLeadDto {
  @IsOptional()
  @IsUUID()
  stageId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}