import { Module } from '@nestjs/common';
import { ErrorMachineController } from './error-machine.controller';
import { ErrorMachineService } from './error-machine.service';
import { ERROR_MACHINE } from 'src/commons/constants/schemaConst';
import { ErrorMachineEntitySchema } from './entity/error-machine.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: ERROR_MACHINE, schema: ErrorMachineEntitySchema }])],

  controllers: [ErrorMachineController],
  providers: [ErrorMachineService]
})
export class ErrorMachineModule {}
