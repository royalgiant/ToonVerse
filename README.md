# README

## Prerequisites/Setup

1. Sign up for (alchemy)[https://www.alchemy.com/] to get api_keys and https/ws urls
2. Install (npm and node)[https://docs.npmjs.com/downloading-and-installing-node-js-and-npm] - I use node version 16.3.0
3. `npm install`
4. Replace `.env.example` with your own keys and addresses in `.env.example`and rename to `.env`
5. (Install hardhat)[https://docs.alchemy.com/docs/hello-world-smart-contract#step-7-download-hardhat]
6. `npx hardhat compile`
7. `npx hardhat run scripts/deploy.js --network polygon_mumbai` (or whatever network you want to deploy to)
8. ** Catch me: Make sure you have the respective ETH/MATIC tokens to pay gas fees.
9. Copy the resulting `artifacts` folder over to the root of `toonverse-node` and note down the contract address, you'll need that.

## Project Description / Problem Statement:

Manga, Manwha, Comic Books, and even literary authors are all content creators. They have created millions of literary and entertaining works. Some extremely popular Web2 apps include Webtoon and Wattpad. Problem is that many authors, like most creators, don’t earn a lot on their creations.

With the advent of NFTs, ToonVerse aims to become a one stop shop for consumers to come consume content (i.e. read manga, manwha, novels, etc.) and for authors/artists to MINT their publications and chapters as NFTs that can be traded on secondary marketplaces like OpenSea and LooksRare. Stretch goal would be to mint NFTs with royalty to author and integrating something like ImmutableX.

## Learnings / Challenges / What Worked, What Didn’t:
- I’m a Rails developer, I did the backend in Rails which includes the Web3 Authentication with Metamask.
- Rails is very good for saving the publication/chapters and making associations between models. But it does NOT work well with Web3 right now.
- Rails integration with Metamask, connecting, and signing is **_extremely_** complicated. 
- NFT Storage is very hard to use because of the lack of documentation. 
- A lot of trial and error went into grabbing the image from S3, uploading the data.Body, and figuring out the format Metamask liked when minting the NFT.
⁃ I would still use NFT.Storage though. Although, it lacked docs, I made it happen.
- Did not use Rails to interact with the smart contract – don’t think you can with today’s current tools (or it is very hard and I didn’t have the time)
- Decided to run a expressJS app on one server (i.e. localhost:5000) and run Rails on another (i.e. localhost:3000)
- Used CORS to let them communicate.
- Rails calls expressJS when minting NFT, which calls smart contract function to MINT NFT, return the txHash to expressJS to Rails to save it in MySQL Database.
- Deployment on Spheron DID NOT work at all – gave up on that.
- A lot of the docs on [Fluence](https://fluence.network/) was broken… :(
- Transactions didn’t send from NodeJS using Infura… something about eth_SendTransaction missing that I wasn’t able to figure out.
- Ended up using Alchemy and Hardhat (so much better)

## Tracks: 
NFTs and Web3 Integration in Web2

# Sponsors Integrations Used:
- AWS S3
- NFT.Storage (IPFS)

## Mumbai Testnet SC Address:
- 0x23C682622B9B5Af492332f470a6Da2bB1BaeB8b5

## Goerli SC Address:
- 0xA5d657DD528457723F13EA9C230b6e3b1da43578
