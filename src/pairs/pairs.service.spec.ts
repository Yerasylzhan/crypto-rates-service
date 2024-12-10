import { Test, TestingModule } from '@nestjs/testing';
import { PairsService } from './pairs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoPair } from './entities/crypto-pair.entity';
import { CreatePairDto } from './dto/create-pair.dto';
import { ExternalRatesService } from '../rates/external-rates.service';
import { RatesService } from '../rates/rates.service';
import { Logger } from '@nestjs/common';
import { UpdatePairDto } from './dto/update-pair.dto';

const mockCryptoPairRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

const mockExternalRatesService = {
  fetchRate: jest.fn(),
};

const mockRatesService = {
  saveRate: jest.fn(),
};

describe('PairsService', () => {
  let service: PairsService;
  let repository: Repository<CryptoPair>;
  let externalRatesService: ExternalRatesService;
  let ratesService: RatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PairsService,
        Logger,
        {
          provide: getRepositoryToken(CryptoPair),
          useValue: mockCryptoPairRepository,
        },
        {
          provide: ExternalRatesService,
          useValue: mockExternalRatesService,
        },
        {
          provide: RatesService,
          useValue: mockRatesService,
        },
      ],
    }).compile();

    service = module.get<PairsService>(PairsService);
    repository = module.get<Repository<CryptoPair>>(getRepositoryToken(CryptoPair));
    externalRatesService = module.get<ExternalRatesService>(ExternalRatesService);
    ratesService = module.get<RatesService>(RatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен создавать пару и сохранять её в базу данных', async () => {
    const createPairDto: CreatePairDto = {
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      isActive: true,
      updateInterval: 5,
    };

    const createdPair = {
      id: 1,
      ...createPairDto,
    };

    mockCryptoPairRepository.create.mockReturnValue(createdPair);
    mockCryptoPairRepository.save.mockResolvedValue(createdPair);

    const result = await service.create(createPairDto);

    expect(mockCryptoPairRepository.create).toHaveBeenCalledWith(createPairDto);
    expect(mockCryptoPairRepository.save).toHaveBeenCalledWith(createdPair);

    expect(result).toEqual(createdPair);
  });

  it('должен возвращать все пары', async () => {
    const pairs = [
      { id: 1, baseCurrency: 'BTC', quoteCurrency: 'USD', isActive: true, updateInterval: 5 },
      { id: 2, baseCurrency: 'ETH', quoteCurrency: 'EUR', isActive: false, updateInterval: 10 },
    ];

    mockCryptoPairRepository.find.mockResolvedValue(pairs);

    const result = await service.findAll();

    expect(mockCryptoPairRepository.find).toHaveBeenCalled();
    expect(result).toEqual(pairs);
  });

  it('должен обновить пару', async () => {
    const id = 1;
    const updatePairDto: UpdatePairDto = {
      isActive: false,
    };

    const updatedPair = {
      id,
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      isActive: false,
      updateInterval: 5,
    };

    mockCryptoPairRepository.update.mockResolvedValue({ affected: 1 });
    mockCryptoPairRepository.findOneBy.mockResolvedValue(updatedPair);

    const result = await service.update(id, updatePairDto);

    expect(mockCryptoPairRepository.update).toHaveBeenCalledWith(id, updatePairDto);
    expect(mockCryptoPairRepository.findOneBy).toHaveBeenCalledWith({ id });
    expect(result).toEqual(updatedPair);
  });

  it('должен удалять пару', async () => {
    const id = 1;

    mockCryptoPairRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.delete(id);

    expect(mockCryptoPairRepository.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual({ affected: 1 });
  });

  it('должен обновлять курсы криптовалют', async () => {
    const pairs = [
      { id: 1, baseCurrency: 'BTC', quoteCurrency: 'USD', isActive: true, updateInterval: 5 },
      { id: 2, baseCurrency: 'ETH', quoteCurrency: 'EUR', isActive: false, updateInterval: 10 },
    ];

    mockCryptoPairRepository.find.mockResolvedValue(pairs);
    mockExternalRatesService.fetchRate.mockResolvedValue(50000);
    mockRatesService.saveRate.mockResolvedValue({});

    await service.updateRates();

    expect(mockCryptoPairRepository.find).toHaveBeenCalled();
    expect(mockExternalRatesService.fetchRate).toHaveBeenCalledWith('btc', 'usd');
    expect(mockRatesService.saveRate).toHaveBeenCalledWith({
      pairId: 1,
      rate: 50000,
      timestamp: expect.any(Date),
    });
    expect(mockExternalRatesService.fetchRate).toHaveBeenCalledTimes(1);
    expect(mockRatesService.saveRate).toHaveBeenCalledTimes(1);
  });
});
