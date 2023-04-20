/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OkRespone } from './commons/okResponse';

@ApiTags('Healthcheck')
@Controller()
export class AppController {
  constructor() { }

  @Get()
  getHello() {
    return new OkRespone();
  }
}
