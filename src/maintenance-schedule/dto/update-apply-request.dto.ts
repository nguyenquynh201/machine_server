import { Transform } from "class-transformer";
import { IsBoolean } from "class-validator";

export class UpdateRequestStaffApplyDto {
    /**
 * Đồng ý hoặc không đồng ý nhận công việc
 * @example false
 */
    @IsBoolean()
    @Transform(({ obj, key }) => {
        const value = obj[key];
        if (typeof value === 'string') {
            return obj[key] === 'true';
        }

        return value;
    })
    isReceive: boolean
}