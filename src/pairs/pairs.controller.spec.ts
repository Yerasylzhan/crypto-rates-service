import { Test, TestingModule } from '@nestjs/testing';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';
import { CreatePairDto } from './dto/create-pair.dto';
import { UpdatePairDto } from './dto/update-pair.dto';

describe('PairsController', () => {
  let controller: PairsController;
  let service: PairsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PairsController],
      providers: [
        {
          provide: PairsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PairsController>(PairsController);
    service = module.get<PairsService>(PairsService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('должен вызывать service.create с правильными аргументами', () => {
      const dto: CreatePairDto = {
        baseCurrency: 'BTC',
        quoteCurrency: 'USD',
        isActive: true,
        updateInterval: 5,
      };
      controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('должен вызывать service.findAll', () => {
      controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
