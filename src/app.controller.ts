import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/stop')
@ApiTags('Utils')
export class AppController {
  @Post()
  stopApplication() {
    process.exit(1);
  }
}
