import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseDatePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new BadRequestException('InvalidDate');
        }
        return date;
    }
}