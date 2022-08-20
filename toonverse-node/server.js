import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
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
// const contract = require('truffle-contract');
// const artifacts = require('./build/Inbox.json');

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

app.post('/upload_and_mint/:id/:name/:description', async (req,res)=>{
    var req = req.params
    var params = {
      Bucket: process.env.S3_BUCKET_DEV,
      Key: req.id
    };
    const data = await s3.getObject(params).promise();
    var fileExtension = mime.extension(data.ContentType);
    var fileName = req.name+"."+fileExtension
    var metadata_url = await storeImageNFT(req.id, data.Body, data.ContentType, req.id+"_"+fileName, req.description)
    res.json({metadata_url: metadata_url})
})

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('https://localhost:8545'))
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// const LMS = contract(artifacts)
// LMS.setProvider(web3.currentProvider)
