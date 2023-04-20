import { PartialType } from '@nestjs/swagger';
import { CreateErrorMachineDto } from './create_error_machine.dto';
export class UpdateErrorMachineDto extends PartialType(CreateErrorMachineDto) { }
