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
IDTToken deployed to: 0xA2E0FD3c343910bd7D1E4af74b0B76Ded048d032 | initialSupply: 100000000000000000000000
Dao deployed to: 0x13bBf70e8AdC0F11c99D8C9787Aa18dab55815b5 | idtToken: 0xA2E0FD3c343910bd7D1E4af74b0B76Ded048d032
ProjectFactory deployed to: 0x93d2f7d05609Ff1b91871D94ED9dc04150772d07
```