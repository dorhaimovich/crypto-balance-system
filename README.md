
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
4. 

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```
