import { Injectable, Logger,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const createdInvoice = await this.invoiceModel.create(createInvoiceDto);
      return createdInvoice;
    } catch (error) {
      this.logger.error('Error creating invoice:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Invoice> {
    try {
      const invoice = await this.invoiceModel.findById(id).exec();
      if (!invoice) {
        throw new NotFoundException(`Invoice with id ${id} not found`);
      }
      return invoice;
    } catch (error) {
      this.logger.error(`Error finding invoice by id ${id}:`, error);
      throw error;
    }
  }

  async findAll(filters: {
    startDate?: string;
    endDate?: string;
  }): Promise<Invoice[]> {
    try {
      const query: any = {};

      if (filters.startDate || filters.endDate) {
        query.date = {
          ...(filters.startDate && { $gte: new Date(filters.startDate) }),
          ...(filters.endDate && { $lte: new Date(filters.endDate) }),
        };
      }
      return await this.invoiceModel.find(query).exec();
    } catch (error) {
      this.logger.error('Error finding all invoices with filters:', error);
      throw error;
    }
  }

  async generateDailySalesSummary() {
    try {
      const startDay = new Date();
      startDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const filters = {
        startDate: startDay.toISOString(),
        endDate: endOfDay.toISOString(),
      };

      const aggregationPipeline = [
        {
          $match: {
            date: {
              $gte: new Date(filters.startDate),
              $lte: new Date(filters.endDate),
            },
          },
        },
        {
          $facet: {
            results: [
              {
                $unwind: '$items',
              },
              {
                $group: {
                  _id: '$items.sku',
                  totalQuantity: { $sum: '$items.qt' },
                  totalSales: { $sum: '$amount' },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSales: { $sum: '$totalSales' },
                  invoiceCount: { $sum: 1 },
                  items: {
                    $push: {
                      sku: '$_id',
                      qt: '$totalQuantity',
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  date: {
                    $dateToString: { format: '%Y-%m-%d', date: new Date() },
                  },
                  totalSales: 1,
                  invoiceCount: 1,
                  items: 1,
                },
              },
            ],
            noResults: [
              {
                $count: 'count',
              },
            ],
          },
        },
        {
          $project: {
            results: {
              $cond: {
                if: { $gt: [{ $arrayElemAt: ['$noResults.count', 0] }, 0] },
                then: { $arrayElemAt: ['$results', 0] },
                else: {
                  date: {
                    $dateToString: { format: '%Y-%m-%d', date: new Date() },
                  },
                  totalSales: 0,
                  invoiceCount: 0,
                  items: [],
                },
              },
            },
          },
        },
        {
          $replaceRoot: { newRoot: '$results' },
        },
      ];

      const summaryReport = await this.invoiceModel
        .aggregate(aggregationPipeline)
        .exec();
      return summaryReport[0];
    } catch (error) {
      this.logger.error('Error generating daily sales summary:', error);
      throw error;
    }
  }
}