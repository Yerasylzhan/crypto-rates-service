import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('PairsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  it('/pairs (POST) Создание новой пары', () => {
    return request(app.getHttpServer())
      .post('/pairs')
      .send({
        baseCurrency: 'BTC',
        quoteCurrency: 'USD',
        isActive: true,
        updateInterval: 5,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.baseCurrency).toBe('BTC');
        expect(response.body.quoteCurrency).toBe('USD');
      });
  });

  it('/pairs (GET) Получение всех пар', () => {
    return request(app.getHttpServer())
      .get('/pairs')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
