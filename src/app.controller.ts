/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OkRespone } from './commons/okResponse';

@Controller()
export class AppController {
  constructor() { }
}