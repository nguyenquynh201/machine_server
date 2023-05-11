import { Prop } from "@nestjs/mongoose";
import { IsString } from "class-validator";

export class VerifyTokenDto {
    @IsString()
    accessToken: string
}