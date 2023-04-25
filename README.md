# IDeal Town

[Interface Demo Video Link](https://drive.google.com/drive/folders/15a796WD9VL8VZorJGnAbeT5JNJcDSR4W?usp=sharing)

[Presentation video](https://youtu.be/XlFkdp0Oelk)

## Description

> Deal it and own it.

Ideal Town is a decentralized freelance platform with tokenized reputation mechanism. Proposers and developers can use the Ideal Town platform to create/find the projects they need.

Traditional freelance platforms may have several issues:

### 1. Trustiness

Limited Knowledge : Can lead to decision bias, errors, and delays because the proposer lacks the necessary knowledge and skills to describe proposals.

- Transparency : Party is not transparent about their processes, costs, or timelines.

### 2. Misaligned expectations

- Developers and customers may have different expectations about the scope, timeline, and outcomes of a project, which can lead to misunderstandings and disagreements.

### 3. Unclear requirements

- Customers may not always have a clear understanding of their own needs, and developers may not fully understand the requirements, which can lead to incomplete or inadequate solutions.

### 4. Quality issues

- Customers may have specific quality requirements for the final product, and if these are not met, it can cause frustration and dissatisfaction.

**But,Ideal Town can address those issues.**

The process of Ideal Town is as follows:

If a proposer creates a project, developers can see information about the project on the website and submit their own solutions. When the project period ends, our platform allows the proposer to vote their preferred solution and allocate project funds to the developers. After the voting stage is completed, we will need some credible reviewers (elected through DAO contract voting) to verify the fairness of the proposer's vote and whether developers have submitted abnormal solutions. This is when the review stage begins, and reviewers will give Reputation to the proposer and developers through Unirep. After the review process is completed, developers can claim their reward through our website and have it sent to a wallet address connected to the site. Our website will also give developers who participate in different projects the ability to claim the project-specific POAP NFT.

## Setup your hardhat environment

```shell
git clone https://github.com/IPromiseSmartContract/IDeal-Town

cd IDeal-Town

yarn

cp .env.example .env

# NOTICE : YOU SHOULD EDIT .env FILE AFTER COPY
```

## Setup your backend environment

```shell
cd backend && poetry install
poetry run python server.py
cd ..
```

## Compile contract

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

## Setup your frontend environment and run frontend

```shell
cd frontend && yarn
yarn dev
```

## Deploy

```shell
npx hardhat run scripts/deploy.ts --network <network>
```

## Verify

```shell
npx hardhat verify --network <network> <address> <constructor>
```

## Deploy contract address

### 1. Chiado

```shell
UniRep deployed to: 0xCa61bFcA0107c5952f8bf59f4D510d111cbcE146
IDTToken deployed to: 0x278AC46F004B49947D76BC536666a0D39a22A5D4
Dao deployed to: 0xC0f9CA995e3BC4fEbc4aCeABf0BD35e132905898
ProjectFactory deployed to: 0x99AF161216030fF2355997eD19DEAea083149559
```

### 2. Thundercore

```shell
UniRep deployed to:
IDTToken deployed to:
Dao deployed to:
ProjectFactory deployed to:
```

### 3. Sepolia

```shell
UniRep deployed to: 0xCa61bFcA0107c5952f8bf59f4D510d111cbcE146
IDTToken deployed to: 0x530510bE29cbf5dAA6807445c2CA4Dca18D0446b | initialSupply: 100000000000000000000000
Dao deployed to: 0xe350595eF613F08d44D301cA124160E1C28c9a11 | idtToken: 0x530510bE29cbf5dAA6807445c2CA4Dca18D0446b
ProjectFactory deployed to: 0xeE0629f0Ad3e3408Bc97cF759B0e5Ea4607e2B65
```

## Team description

| EthTaipei ID | Github | Description |
| -------- | -------- | -------- |
| 徐煜倫     | @alan890104     | A master's student from the Institute of Computer Science and Engineering at NYCU.     |
| CHUAN-YI CHEN     | @parker178912     | A master's student from the Institute of Computer Science and Engineering at NYCU.     |
| 王偉誠      | @skyline9981     | A master's student from the Institute of Computer Science and Engineering at NYCU.     |
| waterso0910     | @WaterSo0910     | A master's student from the Institute of Computer Science and Engineering at NYCU.     |
| 劉力勳     | @ipromise2324     | A master's student from the Institute of Computer Science and Engineering at NYCU.     |
