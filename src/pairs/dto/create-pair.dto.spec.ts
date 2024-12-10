import { CreatePairDto } from './create-pair.dto';
import { validate } from 'class-validator';

describe('CreatePairDto', () => {
  it('должен проходить валидацию при корректных данных', async () => {
    const dto = new CreatePairDto();
    dto.baseCurrency = 'BTC';
    dto.quoteCurrency = 'USD';
    dto.isActive = true;
    dto.updateInterval = 5;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('должен выдавать ошибку при отсутствии обязательных полей', async () => {
    const dto = new CreatePairDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'baseCurrency' }),
        expect.objectContaining({ property: 'quoteCurrency' }),
        expect.objectContaining({ property: 'isActive' }),
        expect.objectContaining({ property: 'updateInterval' }),
      ]),
    );
  });

  it('должен выдавать ошибку при некорректных типах данных', async () => {
    const dto = new CreatePairDto();
    dto.baseCurrency = 'BTC';
    dto.quoteCurrency = 'USD';
    dto.isActive = 'yes' as any;
    dto.updateInterval = -1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'isActive',
          constraints: expect.objectContaining({
            isBoolean: 'isActive must be a boolean value',
          }),
        }),
        expect.objectContaining({
          property: 'updateInterval',
          constraints: expect.objectContaining({
            min: 'updateInterval must not be less than 1',
          }),
        }),
      ]),
    );
  });
});
