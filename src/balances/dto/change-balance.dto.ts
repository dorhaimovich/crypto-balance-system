import { PartialType } from '@nestjs/mapped-types';
import { CreateBalanceDto } from './create-balance.dto';

export class ChangeBalanceDto extends PartialType(CreateBalanceDto) {}
