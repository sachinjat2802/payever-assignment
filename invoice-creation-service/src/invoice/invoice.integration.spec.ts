import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/invoices (POST) should create a new invoice', async () => {
    const createInvoiceDto: CreateInvoiceDto = {
      customer: 'John Doe',
      amount: 1500,
      reference: 'INV-12345',
      date: new Date('2023-10-01T00:00:00.000Z'),
      items: [
        { sku: 'ITEM-001', qt: 2 },
        { sku: 'ITEM-002', qt: 5 },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/invoices')
      .send(createInvoiceDto)
      .expect(201);

    expect(response.body);
  });

  it('/invoices/:id (GET) should find an invoice by ID', async () => {
    const invoiceId = '66d05f0b84e6cbdaf4c7d908'; // Replace with a valid ID from your database

    const response = await request(app.getHttpServer())
      .get(`/invoices/${invoiceId}`)
      .expect(200);

    expect(response.body);
  });

  it('/invoices (GET) should find all invoices with date filters', async () => {
    const startDate = '2023-10-01';
    const endDate = '2023-10-31';

    const response = await request(app.getHttpServer())
      .get('/invoices')
      .query({ startDate, endDate })
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((invoice) => {
      expect(new Date(invoice.date).getTime()).toBeGreaterThanOrEqual(
        new Date(startDate).getTime(),
      );
      expect(new Date(invoice.date).getTime()).toBeLessThanOrEqual(
        new Date(endDate).getTime(),
      );
    });
  });

  it('/invoices (GET) should find all invoices without filters', async () => {
    const response = await request(app.getHttpServer())
      .get('/invoices')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });
});
