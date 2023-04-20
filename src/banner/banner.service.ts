/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { CreateBannerDto } from './dto/create-banner.dto';
import { Banner, BannerDocument } from './entities/banner.entity';
import { Status } from 'aws-sdk/clients/directconnect';
import { nanoid } from 'nanoid';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { deleteFile, uploadFile, signedUrl, deleteManyFiles } from 'src/commons/utils/s3Client';
import { StaticFile } from 'src/commons/utils/staticFile';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerType } from './interface/banner-type';
import { TypeImg } from 'src/commons/enums/typeimgs';

@Injectable()
export class BannerService {
    constructor(
        @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,

    ) {

    }
    create(createBannerDto: CreateBannerDto, authUser: JwtUser) {
        return new this.bannerModel(createBannerDto)
            .save();
    }
    async findAll(authUser: JwtUser, query?: Paginate & { search?: string, status?: Status, bannerType?: BannerType }) {
        const filter: FilterQuery<BannerDocument> = {};
        if (query.search) {
            filter.$text = { $search: query.search };
        }
        const cmd = this.bannerModel.find(filter)
            .lean({ autopopulate: true })
        if (query.status) {
            cmd.where('status', query.status)
        }
        if (query.bannerType) {
            cmd.where('bannerType', query.bannerType)
        }
        if (query.limit) {
            cmd.limit(query.limit)
        }
        if (query.offset) {
            cmd.skip(query.offset)
        }
        const totalCmd = this.bannerModel.countDocuments(cmd.getQuery());
        const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

        return { data, total };
    }

    findOne(id: string, authUser: JwtUser) {
        return this.bannerModel.findById(id)
            .orFail(new NotFoundException(ErrCode.E_BANNER_NOT_FOUND))
            .lean({ autopopulate: true })
            .exec();
    }

    update(id: string, updateBannerDto: UpdateBannerDto, authUser: JwtUser) {
        return this.bannerModel.findByIdAndUpdate(id, updateBannerDto, { new: true })
            .orFail(new NotFoundException(ErrCode.E_BANNER_NOT_FOUND))
            .exec()
    }

    async remove(id: string, userReq: JwtUser) {
        const doc = await this.bannerModel.findById(id)
            .orFail(new NotFoundException(ErrCode.E_BANNER_NOT_FOUND))
            .exec()
        const keys = [];
        for (let i = 0; i < doc.image.length; i++) {
            const { pathUpload, filename } = StaticFile.getFileName(doc.image[i].url);
            if (pathUpload == 'imageServer') {
                // delete file server
                const url = StaticFile.getLocalFileUpload('banner', filename);
                StaticFile.deleteStaticFile(url);
            } else {
                // delete file aws3
                keys.push(doc.image[i].url);
            }
        }
        if (keys.length > 0) {
            deleteManyFiles(keys);
        }

        return doc.delete();
    }


    async uploadImg(id: string, file: Express.Multer.File, authUser: JwtUser, filename?: string, description?: string) {
        const doc = await this.bannerModel.findById(id)
            .orFail(new NotFoundException(ErrCode.E_BANNER_NOT_FOUND))
            .exec();

        // uploadFile aws3
        const random = nanoid(16);
        const url = `banner/imageServer/${id}/${random}.png`;

        doc.image.push({
            name: filename || file.originalname,
            description: description,
            url: url,
            mimetype: file.mimetype,
            size: file.size
        });

        return doc.save();
    }

    async deleteImage(id: string, fileId: string, userReq: JwtUser) {
        const doc = await this.bannerModel.findById(id)
            .select('imageServer')
            .orFail(new NotFoundException(ErrCode.E_BANNER_NOT_FOUND))
            .exec();

        let fileObj = doc.image.find(f => f['_id'] == fileId);
        if (!fileObj) {
            throw new BadRequestException(ErrCode.E_PRODUCT_FILE_NOT_FOUND);
        }
        const { pathUpload, filename } = StaticFile.getFileName(fileObj.url);
        // delete file server

        const url = StaticFile.getLocalFileUpload('banner', filename);
        StaticFile.deleteStaticFile(url);

        doc.image.pull(fileObj);

        return doc.save();
    }

    async getImg(ctgId: string, fileName: string) {
        // get file aws3
        const key = `banner/imageServer/${ctgId}/${fileName}`;
        return await signedUrl(key);
    }

    // upload file server
    async uploadImgServer(id: string, file: Express.Multer.File, authUser: JwtUser, filename?: string, description?: string) {
        const doc = await this.bannerModel.findById(id)
            .orFail(new NotFoundException(ErrCode.E_BANNER_NOT_FOUND))
            .exec();

        // uploadFile aws3
        const url = `banner/imageServer/${id}/${file.filename}`;

        doc.image.push({
            name: filename || file.originalname,
            description: description,
            url: url,
            mimetype: file.mimetype,
            size: file.size
        });

        return doc.save();
    }

    async getImgServer(fileName: string) {
        // get file server
        const key = StaticFile.getLocalFileUpload('banner', fileName);
        return key;
    }
}
