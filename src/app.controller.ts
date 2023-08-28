import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from './auth/decorators';

@Controller('/throw')
@ApiTags('Utils')
export class AppController {
  @Post()
  @SkipAuth()
  stopApplication() {
    throw new Error('error thrown from helper endpoint');
  }
}
