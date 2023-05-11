import { IsString } from "class-validator";

export class CreateNotifyStaff{
        /**
     * Send notification staff apply maintenance schedule
     * @example id maintenance schedule
     */
    @IsString()
    idStaff: string;
    
}