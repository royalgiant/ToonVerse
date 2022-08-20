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
import ToonVerse from '../build/contracts/ToonVerse.json' assert {type: 'json'};
// const artifacts = require('./build/Inbox.json');

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,  
  secretAccessKey: process.env.SECRET_KEY, 
  Bucket: process.env.S3_BUCKET_DEV    
});

const network = process.env.ETHEREUM_NETWORK;
if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider); 
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`));
}
const networkId = await web3.eth.net.getId()
const ToonVerseNetworkData = ToonVerse.networks[networkId]
const contract = new web3.eth.Contract(ToonVerse.abi, ToonVerseNetworkData.address)

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
    console.log(process.env.TEST_ACCOUNT_PUBLIC_ADDESS)
    // Generate a transaction to calls the `mintNFT` method
    const tx = contract.methods.mintNFT(process.env.TEST_ACCOUNT_PUBLIC_ADDESS, metadata_url)
    // Send the transaction to the network
    const receipt = await tx
    .send({
      from: process.env.TEST_ACCOUNT_PUBLIC_ADDESS,// the account that'll pay for the transaction
      gas: await tx.estimateGas(),
    })
    .on('transactionHash', (txhash) => {
      console.log(`Mining transaction ...`)
      console.log(`https://${network}.etherscan.io/tx/${txhash}`)
    })
    .on('error', function(error){
      console.error(`An error happened: ${error}`)
      callback()
    })
    .then(function(receipt){
      // Success, you've minted the NFT. The transaction is now on chain!
      console.log(
          `Success: The NFT has been minted and mined in block ${receipt.blockNumber}`)
      callback()
    })

    res.json({metadata_url: metadata_url})
})

app.use(cors())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// const LMS = contract(artifacts)
// LMS.setProvider(web3.currentProvider)
