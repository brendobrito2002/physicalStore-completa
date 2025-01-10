import { Test, TestingModule } from '@nestjs/testing';
import { DistanceMatrixService } from './distance-matrix.service.ts.service';

describe('DistanceMatrixServiceTsService', () => {
  let service: DistanceMatrixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistanceMatrixService],
    }).compile();

    service = module.get<DistanceMatrixService>(DistanceMatrixService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
