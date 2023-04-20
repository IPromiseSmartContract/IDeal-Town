# IDeal Town

Deal it and own it.

IDeal Town is a decentralized project management platform that enables collaboration between proposers, developers, and reviewers using a smart contract. Proposers can initiate projects, developers can submit solutions, and reviewers can review the solutions. The platform utilizes the IDTToken and IPJToken for transactions, and it integrates with the Unirep protocol for reputation management.

## Install dependencies

```shell
yarn
```

## Compile

```shell
npx hardhat compile
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
npx hardhat run scripts/deploy.ts
```

## Verify

```shell
npx hardhat verify --network <network> <address> <constructor>
```
