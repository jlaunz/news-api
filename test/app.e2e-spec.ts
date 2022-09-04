import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

import * as request from 'supertest';
import { CreateCustomerDto, CreateOpportunityDto } from 'src/model';
import { PrismaClient } from '@prisma/client';
import { customersData, opportunitiesData } from 'db/mockData';

const APP_PORT = 8003;

async function populateMockData(prisma: PrismaClient) {
  for (const e of customersData) {
    const customer = await prisma.customer.create({
      data: e,
    });
  }

  for (const e of opportunitiesData) {
    const customer = await prisma.opportunity.create({
      data: e,
    });
  }
}

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const clearDB = async () => {
    await prisma.$transaction([
      prisma.customer.deleteMany(),
      prisma.opportunity.deleteMany(),
    ]);
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    app.listen(APP_PORT);
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await clearDB();
    await populateMockData(prisma);
  });

  afterAll(() => {
    app.close();
  });

  describe('Customer endpoints', () => {
    describe('Get customers', () => {
      it('Should get all customers', async () => {
        const { status, body } = await request(app.getHttpServer()).get(
          '/customers',
        );
        expect(status).toBe(200);
        expect(body.length).toStrictEqual(customersData.length);
      });

      it('Should get filtered customers', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get('/customers')
          .query({ status: 'ACTIVE' });
        expect(status).toBe(200);
        expect(body.length).toStrictEqual(2);
      });
    });

    describe('Create customers', () => {
      const newCustomerData: CreateCustomerDto = {
        name: 'The New',
        email: 'new@mail.com',
        addressLines: 'some address',
        status: 'ACTIVE',
        postcode: '0666',
      };

      it('should successfully create a customer', async () => {
        const beforeCount = await prisma.customer.count();

        const { status, body } = await request(app.getHttpServer())
          .post('/customers')
          .send(newCustomerData);

        const afterCount = await prisma.customer.count();

        expect(status).toBe(201);
        expect(afterCount - beforeCount).toBe(1);
      });
    });

    describe('Update customers', () => {
      it('should successfully update a customer', async () => {
        const newName = `${Math.random()}`;
        const id = 0;
        const { status, body } = await request(app.getHttpServer())
          .patch(`/customers/${id}`)
          .send({
            name: newName,
          });

        expect(status).toBe(200);
        expect(body.name).toStrictEqual(newName);
      });

      it('should fail the update if wrong id was provided', async () => {
        const newName = `${Math.random()}`;
        const id = 99999;
        const { status, body } = await request(app.getHttpServer())
          .patch(`/customers/${id}`)
          .send({
            name: newName,
          });

        expect(status).toBe(404);
      });
    });
  });

  describe('Opportunity endpoints', () => {
    describe('Get opportunities', () => {
      it('Should get all opportunities', async () => {
        const { status, body } = await request(app.getHttpServer()).get(
          '/opportunities',
        );
        expect(status).toBe(200);
        expect(body.length).toStrictEqual(opportunitiesData.length);
      });
    });

    describe('Create opportunity', () => {
      const newOpportunity: CreateOpportunityDto = {
        name: 'The New opportunity',
        status: 'NEW',
        customerId: 0,
      };

      it('should successfully create an opportunity', async () => {
        const beforeCount = await prisma.opportunity.count();

        const { status, body } = await request(app.getHttpServer())
          .post('/opportunities')
          .send(newOpportunity);

        const afterCount = await prisma.opportunity.count();

        expect(status).toBe(201);
        expect(afterCount - beforeCount).toBe(1);
      });
    });

    describe('Update opportunities', () => {
      it('should successfully update an opportunity', async () => {
        const newStatus = `CLOSED_WON`;
        const id = 2;
        const { status, body } = await request(app.getHttpServer())
          .patch(`/opportunities/${id}`)
          .send({
            status: newStatus,
          });

        expect(status).toBe(200);
        expect(body.status).toStrictEqual(newStatus);
      });
    });
  });
});
