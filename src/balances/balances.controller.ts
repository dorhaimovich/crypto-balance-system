import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('balances')
export class BalancesController {
  @Get()
  getAllBalances() {
    return 'All balances';
  }

  @Get(':asset')
  getOneBalance(@Param('asset') asset: string) {
    return asset;
  }

  @Post()
  createAsset(@Body() asset: object) {
    return asset;
  }

  @Patch(':asset')
  updateAsset(@Param('asset') asset: string, @Body() body: object) {
    return { asset, ...body };
  }

  @Delete(':asset')
  removeAsset(@Param('asset') asset: string) {
    return asset;
  }
}
