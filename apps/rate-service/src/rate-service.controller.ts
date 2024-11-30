import { Controller } from '@nestjs/common';
import { RateServiceService } from './rate-service.service';

@Controller()
export class RateServiceController {
  constructor(private readonly rateServiceService: RateServiceService) {}
}
