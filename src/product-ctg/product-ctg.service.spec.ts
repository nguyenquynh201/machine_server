import { Test, TestingModule } from '@nestjs/testing';
import { ProductCtgService } from './product-ctg.service';

describe('ProductCtgService', () => {
  let service: ProductCtgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCtgService],
    }).compile();

    service = module.get<ProductCtgService>(ProductCtgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
