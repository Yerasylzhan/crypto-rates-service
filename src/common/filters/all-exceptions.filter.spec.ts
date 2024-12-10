import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpException, ArgumentsHost, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let response: Partial<Response>;
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ url: '/test' }),
      }),
    } as any;
  });

  it('должен обрабатывать HttpException', () => {
    const exception = new HttpException('Тестовая ошибка', 400);
    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String),
      path: '/test',
      message: 'Тестовая ошибка',
    });
  });

  it('должен обрабатывать неизвестные ошибки как InternalServerError', () => {
    const exception = new Error('Неизвестная ошибка');
    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      path: '/test',
      message: 'Internal server error',
    });
  });
});
