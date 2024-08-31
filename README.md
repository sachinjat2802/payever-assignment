# Invoice and Consumer Services

This repository contains two services: `invoice-service` and `consumer-service`. These services are set up to run using Docker and Docker Compose.


### Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)
- update Docker Compose  file with your hosted MONGO_URL,RABBITMQ_URL

Note: Docker Compose environment variables will be valid for only 7 days. After that, insert new ones and test.

### API Endpoint curls are as follows

## POST /invoices - Create a new invoice.
curl --location 'http://localhost:3000/invoices' \
--header 'Content-Type: application/json' \
--header 'Content-Type: application/json' \
--data '{
    "customer": "John Doe",
    "amount": 1500,
    "reference": "INV-12345",
    "date": "2023-10-01T00:00:00.000Z",
    "items": [
        {
            "sku": "ITEM-001",
            "qt": 2
        },
        {
            "sku": "ITEM-002",
            "qt": 5
        }
    ]
}'

## GET /invoices/:id - Retrieve a specific invoice by ID.
curl --location 'http://localhost:3000/invoices/66d0c427107fb9f962d30110'

## GET /invoices - Retrieve a list of all invoices (with optional filters like date range).
curl --location 'http://localhost:3000/invoices?startDate=2023-10-01&endDate=2023-10-31'




