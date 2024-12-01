
## Project Overview

The Crypto Balances Management System is a NestJS-based backend system designed to manage user balances, particularly in cryptocurrencies. It provides functionalities to:

* Retrieve individual or total balances in various currencies.
* Add or update balances.
* Rebalance portfolios with customizable target percentages.

This service integrates with a database system (node-json-db) and external APIs for real-time exchange rates, ensuring accurate balance calculations.

## Project setup

### Prerequisites

Ensure the following are installed on your system:

* Node.js (>= v16.x)
* npm
* Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dorhaimovich/crypto-balance-system.git
cd crypto-balance-system
```

2. Install dependencies:

```bash
$ npm install
```

3. Add .env file to root folder
   
4. Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Brief Approach Explanation

This service is designed to manage user cryptocurrency balances efficiently. It follows a modular approach using **NestJS**, emphasizing clean code structure and extensibility. Key features include:

- **Daily Currency and Rates Synchronization**: Supported currencies and coin rates are fetched daily from an external API, ensuring up-to-date information and flexibility in handling various cryptocurrencies.
- **Validation with Class-validator**: Data validation is implemented using class-validator decorators, ensuring API inputs are accurate and consistent.
- **Error Handling**: Custom exceptions and a global exception filter provide clear error messages and centralized error management.  
- **Logging**: Detailed logs for each API call and critical operations facilitate monitoring and debugging.

## Expected API Outputs

Below are the expected outputs for the key API endpoints:

### Get All Balances

Endpoint: GET /balances

Description: Fetch all balances of a specific user.

Example Request:

```bash
GET /balances
```

Expected Response:

```bash
[
    {
        "coin": "tether",
        "symbol": "usdt",
        "amount": 559
    },
    {
        "coin": "ethereum",
        "symbol": "eth",
        "amount": 1530.982700519926
    },
    {
        "coin": "bitcoin",
        "symbol": "btc",
        "amount": 26.000021931794528
    }
]
```

### Get One Balance

Endpoint: GET /balances/:coin

Description: Fetch the balance of a specific coin.

Example Request:

```bash
GET /balances/tether
```

Expected Response:

```bash
{
    "coin": "tether",
    "symbol": "usdt",
    "amount": 119
}
```

### Create Balance

Endpoint: POST /balances

Description: create a new balance for a specific user.

Example Request:

```bash
POST /balances
```

Expected Request Body:

```bash
{
    "coin": "polkadot",
    "symbol": "dot",
    "amount": 100
}
```

Expected Response:

```bash
{
    "coin": "polkadot",
    "symbol": "dot",
    "amount": 100
}
```

### Delete Balance

Endpoint: DELETE /balances/:coin

Description: remove a balance of a specific coin.

Example Request:

```bash
DELETE /balances/solana
```

Expected Response:

```bash
{
    "coin": "solana",
    "symbol": "sol",
    "amount": 134
}
```
