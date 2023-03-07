import { BadRequestException } from "@nestjs/common";

function multerFileFilter(fileFilters: string[] | null) {
    return function (req, file, cb) {
        if (fileFilters) {
            const extensionToUpperCase = fileFilters.map(e => e.toLowerCase());
            if (extensionToUpperCase.indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
                return cb(new BadRequestException('UnsupportExtension'));
            }
            cb(null, true);
        } else {
            cb(null, true);
        }
    }
}

export {
    multerFileFilter
}