import { Controller, NotImplementedException, Post } from '@nestjs/common';

@Controller('clock-in')
export class ClockInController {
  @Post('photo')
  validatePhoto() {
    throw new NotImplementedException('POST /clock-in/photo is not implemented yet');
  }
}
