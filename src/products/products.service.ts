/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, LeanDocument, Model } from 'mongoose';
import { PRODUCT } from 'src/commons/constants/schemaConst';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument } from './entities/product.entity';
import { QueryProduct } from './dto/query-product.dto';
import { filterParams } from 'src/commons/utils/filterParams';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { UserRole } from 'src/users/interface/userRoles';
import { UpdateProductTrueDto } from './dto/update-product-true.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { nanoid } from 'nanoid';
import { deleteFile, signedUrl, uploadFile } from 'src/commons/utils/s3Client';
import { TypeImg } from 'src/commons/enums/typeimgs';
import { StaticFile } from 'src/commons/utils/staticFile';
@Injectable()
export class ProductsService {
  historyService: any;

  constructor(
    @InjectModel(PRODUCT) private model: Model<ProductDocument>,
  ) { }
  async create(dto: CreateProductDto, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    const exist = await this.model.exists({
      serialNumber: dto.serialNumber
    });
    if (exist) {
      throw new BadRequestException(ErrCode.E_PRODUCT_EXISTED);
    }
    return this.model.create(dto);
  }

  async findAll(authUser: JwtUser, query?: Paginate & QueryProduct) {

    let filter: FilterQuery<ProductDocument> = {};

    if (query.search) {
      filter.$text = { $search: `${query.search}`, $language: "en" };
    }

    const cond = filterParams(query, ['nameMaintenance', 'serialNumber']);
    const cmd = this.model.find({ ...filter, ...cond })
      .lean({ autopopulate: true })


    if (query.limit) {
      cmd.limit(query.limit);
    }
    if (query.offset) {
      cmd.skip(query.offset);
    }
    const totalCmd = this.model.countDocuments(cmd.getQuery());
    const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

    return { total, data };

  }

  findOne(id: string, authUser: JwtUser) {
    return this.model.findById(id)
      .lean({ autopopulate: true })
      .orFail(new NotFoundException())
      .exec();
  }

  update(id: string, dto: UpdateProductDto, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.findByIdAndUpdate(id, dto, { new: true })
      .orFail(new NotFoundException())
      .exec();
  }

  remove(id: string, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.findByIdAndDelete(id)
      .orFail(new NotFoundException())
      .exec();

  }

  async getNgang(file: Express.Multer.File, userReq: JwtUser, limit?: number, offset?: number) {
    if (userReq.role != UserRole.Admin) {
      throw new ForbiddenException();
    }

    const listCode = this.getCodeNgang(file);
    const codes = this.addQuoteToDuplicates(listCode);
    const cmd = this.model.find()
      .lean({ autopopulate: true })
      .where('code').in(codes)

    if (limit) {
      cmd.limit(limit);
    }
    if (offset) {
      cmd.skip(offset);
    }

    const totalCmd = this.model.countDocuments(cmd.getQuery());
    const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

    return { total, data };
  }

  async getDoc(file: Express.Multer.File, userReq: JwtUser, limit?: number, offset?: number) {
    if (userReq.role != UserRole.Admin) {
      throw new ForbiddenException();
    }

    const listCode = this.getCodeDoc(file);
    const codes = this.addQuoteToDuplicates(listCode);
    const cmd = this.model.find()
      .lean({ autopopulate: true })
      .where('code').in(codes)
    if (limit) {
      cmd.limit(limit);
    }
    if (offset) {
      cmd.skip(offset);
    }
    const totalCmd = this.model.countDocuments(cmd.getQuery());
    const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

    return { total, data };
  }

  async getNgangDoc(file: Express.Multer.File, userReq: JwtUser, limit?: number, offset?: number) {
    if (userReq.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    const listCodeNgang = this.getCodeNgang(file);
    const listCodeDoc = this.getCodeDoc(file);
    const codes = this.addQuoteToDuplicates([...listCodeNgang, ...listCodeDoc]);

    const cmd = this.model.find()
      .lean({ autopopulate: true })
      .where('code').in(codes)
    if (limit) {
      cmd.limit(limit);
    }
    if (offset) {
      cmd.skip(offset);
    }
    const totalCmd = this.model.countDocuments(cmd.getQuery());
    const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

    return { total, data };
  }

  getCodeNgang(file: Express.Multer.File) {
    const listCode = [];
    //read file txt
    const a = file.buffer.toString();
    const b = a.split('\r\n')
    const c = b.filter(item => {
      return ((item.indexOf('ngang') != -1) && (item.indexOf('=') != -1))
    })
    const d = c.map(item => {
      if (item.indexOf('…') != -1) {
        return item.replace('…', '...')
      } else if ((item.indexOf('..') != -1) && item[item.indexOf('..') + 2] != '.') {
        return item.replace('..', '...')
      } else {
        return item
      }
    })
    d.forEach(item => {
      if ((item.split('...').length - 1) == 1) {
        const tmp = item.split(' ')
        if (item[item.indexOf('...') + 3] != ' ') {
          listCode.push(tmp.find(i => i.indexOf('...') != -1).slice(3))
        } else {
          listCode.push(tmp[tmp.indexOf('...') + 1])
        }
      } else {
        const tmp = item.split('...')
        if (tmp[1].trim().split(' ').length > 1) {
          listCode.push(tmp[1].trim().split(' ')[0].trim())
        } else {
          if (tmp[1].indexOf('▪︎') != -1) {
            listCode.push(tmp[1].slice(0, tmp[1].indexOf('▪︎')).trim())
          } else {
            listCode.push(tmp[1].trim())
          }
        }
      }
    })
    return listCode;
  }

  getCodeDoc(file: Express.Multer.File) {
    const day = new Date();
    const dayOfWeek = day.getDay();
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

    const listCode = [];
    const a = file.buffer.toString();
    const b = a.split('\r\n')
    const c = b.filter(i => {
      if (i.indexOf('=') != -1) {
        if (i.indexOf(weekdays[dayOfWeek]) != -1) {
          return i;
        }
      }
    })
    const d = c.map(i => {
      if (i.indexOf('…') != -1) {
        return i.replace('…', '...')
      } else if ((i.indexOf('..') != -1) && i[i.indexOf('..') + 2] != '.') {
        return i.replace('..', '...')
      } else {
        return i
      }
    })
    d.map(i => {
      if ((i.split('...').length - 1) == 1) {
        const t = i.split(' ')
        if (i[i.indexOf('...') + 3] != ' ') {
          listCode.push(t.find(j => j.indexOf('...') != -1).slice(3))
        } else {
          listCode.push(t[t.indexOf('...') + 1])
        }
      } else {
        const t = i.split('...')
        if (t[1].trim().split(' ').length > 1) {
          listCode.push(t[1].trim().split(' ')[0].trim())
        } else {
          if (t[1].indexOf('▪︎') != -1) {
            listCode.push(t[1].slice(0, t[1].indexOf('▪︎')).trim())
          } else {
            listCode.push(t[1].trim())
          }
        }
      }
      return i;
    })

    return listCode;
  }

  updateAllFalse(authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.updateMany({ show: true }, { $set: { show: false } })
      .lean()
      .exec();
  }

  updateTrue(dto: UpdateProductTrueDto, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.updateMany({ _id: { $in: dto.listId } }, { $set: { show: true } })
      .lean()
      .exec();
  }

  deleteProducts(dto: DeleteProductDto, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.deleteMany({ _id: { $in: dto.listId } })
      .lean()
      .exec();
  }

  addQuoteToDuplicates(arr: string[]) {
    const count = {};
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (count[item]) {
        const lastIndex = item.search(/[a-z](?!.*[a-z])/);
        const str = "'".repeat(count[item]);
        const newItem = item.slice(0, lastIndex + 1) + str + item.slice(lastIndex + 1);
        result.push(newItem);
        count[item]++;
      } else {
        result.push(item);
        count[item] = 1;
      }
    }
    return result;
  }

  // upload file server
  async uploadImgServer(id: string, file: Express.Multer.File, authUser: JwtUser, filename?: string, description?: string) {
    const doc = await this.model.findById(id)
      .orFail(new NotFoundException(ErrCode.E_PRODUCT_NOT_FOUND))
      .exec();

    // uploadFile server
    const url = `products/imageServer/${id}/${file.filename}`;

    doc.imageMachine.push({
      name: filename || file.originalname,
      description: description,
      url: url,
      mimetype: file.mimetype,
      size: file.size
    });

    return doc.save();
  }

  async deleteImage(id: string, fileId: string, userReq: JwtUser) {

    const doc = await this.model.findById(id)
      .select('imageMachine')
      .orFail(new NotFoundException(ErrCode.E_PRODUCT_NOT_FOUND))
      .exec();

    let fileObj = doc.imageMachine.find(f => f['_id'] == fileId);
    if (!fileObj) {
      throw new BadRequestException(ErrCode.E_PRODUCT_FILE_NOT_FOUND);
    }
    const { pathUpload, filename } = StaticFile.getFileName(fileObj.url);
    // delete file server

    const url = StaticFile.getLocalFileUpload('products', filename);
    StaticFile.deleteStaticFile(url);

    doc.imageMachine.pull(fileObj);

    return doc.save();
  }

  async getImgServer(fileName: string) {
    // get file server
    const key = StaticFile.getLocalFileUpload('products', fileName);
    console.log("key ::", key);
    return key;
  }
}



