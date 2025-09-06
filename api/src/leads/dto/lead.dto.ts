import { IsString, IsEmail, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @IsOptional()
  @IsString()
  adPlatform?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tags?: string[];
}

export class UpdateLeadStageDto {
  @IsUUID()
  stageId?: string;
}

export class UpdateLeadTagsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}
