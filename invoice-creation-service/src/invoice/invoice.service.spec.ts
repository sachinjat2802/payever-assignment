import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoiceService } from './invoice.service';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

const mockInvoice = {
  customer: 'John Doe',
  amount: 1500,
  reference: 'INV-12345',
  date: new Date('2023-10-01T00:00:00.000Z'),
  items: [
    { sku: 'ITEM-001', qt: 2 },
    { sku: 'ITEM-002', qt: 5 },
  ],
};

const mockInvoiceModel = {
  create: jest.fn().mockResolvedValue(mockInvoice),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockInvoice),
  }),
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockInvoice]),
  }),
};

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: Model<Invoice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
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

      const result = await service.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
      expect(model.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });

  describe('findById', () => {
    it('should find an invoice by ID', async () => {
      const result = await service.findById('someId');
      expect(result).toEqual(mockInvoice);
      expect(model.findById).toHaveBeenCalledWith('someId');
    });
  });

  describe('findAll', () => {
    it('should find all invoices with date filters', async () => {
      const filters = { startDate: '2023-10-01', endDate: '2023-10-31' };
      const result = await service.findAll(filters);
      expect(result).toEqual([mockInvoice]);
      expect(model.find).toHaveBeenCalledWith({
        date: {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        },
      });
    });

    it('should find all invoices without filters', async () => {
      const result = await service.findAll({});
      expect(result).toEqual([mockInvoice]);
      expect(model.find).toHaveBeenCalledWith({});
    });
  });
});
