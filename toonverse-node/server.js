import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
const app = express()
const port = 3001
import AWS from "aws-sdk"
import { NFTStorage } from 'nft.storage'
import mime from "mime-types"
import * as IPFS from "ipfs-core"
import makeIpfsFetch from 'js-ipfs-fetch'
const ipfs = await IPFS.create()
const fetch = await makeIpfsFetch({ipfs})
const client = new NFTStorage({token: process.env.NFT_STORAGE_API_KEY})
import Web3 from "web3"
import ethers from "ethers"
import ToonVerse from '../artifacts/contracts/ToonVerse.sol/ToonVerse.json' assert {type: 'json'};

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(process.env.MUMBAI_NETWORK, process.env.ALCHEMY_API_KEY);
// Signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, alchemyProvider);
// Contract
const tvContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ToonVerse.abi, signer);

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,  
  secretAccessKey: process.env.SECRET_KEY, 
  Bucket: process.env.S3_BUCKET_DEV    
});

// const contract = await ToonVerse.deployed()
// await contract.mintNFT("0x9aB8d0C7B218a7971b6BFe580d9FDBe8E8adb98B", "ipfs://bafyreigqfy2gafrbxibnuj74isbh6fr6us2d224fril5dqquhniaqrij7y/metadata.json")
async function storeImageNFT(id, image, content_type, name, description) {
  var image_blob = new Blob([image], {type: content_type})
  const nft = {
    image: image_blob, // use image Blob as `image` field
    name: name,
    description: description
  }
  const metadata = await client.store(nft)
  console.log('Metadata URI: ', metadata.url)
  return metadata.url
}

app.post('/upload_and_mint/:id/:name/:description', cors(), async (req,res)=>{
    var req = req.params
    var params = {
      Bucket: process.env.S3_BUCKET_DEV,
      Key: req.id
    };
    const data = await s3.getObject(params).promise();
    var fileExtension = mime.extension(data.ContentType);
    var fileName = req.name+"."+fileExtension
    var metadata_url = await storeImageNFT(req.id, data.Body, data.ContentType, req.id+"_"+fileName, req.description)

    console.log("Minting NFT");
    const tx = await tvContract.mintNFT(process.env.TEST_ACCOUNT_PUBLIC_ADDRESS, metadata_url)
    const receipt = await tx.wait();
    console.log(receipt.transactionHash)
    res.json({metadata_url: metadata_url, txHash: receipt.transactionHash})
})

app.use(cors({
  origin: '*'
}))

app.listen(port, () => {
  console.log(`ToonVerse listening on port ${port}`)
})
// const LMS = contract(artifacts)
// LMS.setProvider(web3.currentProvider)
