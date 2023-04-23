# IDeal Town

Deal it and own it.

IDeal Town is a decentralized project management platform that enables collaboration between proposers, developers, and reviewers using a smart contract. Proposers can initiate projects, developers can submit solutions, and reviewers can review the solutions. The platform utilizes the IDTToken and IPJToken for transactions, and it integrates with the Unirep protocol for reputation management.

## Setup your hardhat environment

```shell
git clone https://github.com/IPromiseSmartContract/IDeal-Town

cd IDeal-Town

yarn

cp .env.example .env

# NOTICE : YOU SHOULD EDIT .env FILE AFTER COPY
```

## Setup your frontend environment

```shell
cd frontend && yarn
```

## Setup your frontend environment and run backend

```shell
cd backend && poetry install
poetry run python server.py
```

## Compile contract and run frontend

```shell
npx hardhat compile
yarn dev
```

## Test with gas report

```shell
REPORT_GAS=true npx hardhat test
```

## Test with coverage report

```shell
npx hardhat coverage
```

## Deploy

```shell
npx hardhat run scripts/deploy.ts --network <network>
```

## Verify

```shell
npx hardhat verify --network <network> <address> <constructor>
```

## Deployment

## Sepolia

```shell
UniRep deployed to: 0xCa61bFcA0107c5952f8bf59f4D510d111cbcE146
IDTToken deployed to: 0x530510bE29cbf5dAA6807445c2CA4Dca18D0446b | initialSupply: 100000000000000000000000
Dao deployed to: 0xe350595eF613F08d44D301cA124160E1C28c9a11 | idtToken: 0x530510bE29cbf5dAA6807445c2CA4Dca18D0446b
ProjectFactory deployed to: 0xeE0629f0Ad3e3408Bc97cF759B0e5Ea4607e2B65
```