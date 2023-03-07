import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { ContainersController } from './containers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CONTAINER } from 'src/commons/constants/schemaConst';
import { ContainerSchema } from './entities/container.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: CONTAINER,
        useFactory: () => ContainerSchema,
      }
    ]),
  ],
  controllers: [ContainersController],
  providers: [ContainersService]
})
export class ContainersModule { }
