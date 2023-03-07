import { Test, TestingModule } from '@nestjs/testing';
import { ProductCtgController } from './product-ctg.controller';
import { ProductCtgService } from './product-ctg.service';

describe('ProductCtgController', () => {
  let controller: ProductCtgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCtgController],
      providers: [ProductCtgService],
    }).compile();

    controller = module.get<ProductCtgController>(ProductCtgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
