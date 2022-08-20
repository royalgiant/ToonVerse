async function main() {
   const ToonVerse = await ethers.getContractFactory("ToonVerse");

   // Start deployment, returning a promise that resolves to a contract object
   const toon_verse = await ToonVerse.deploy();   
   console.log("Contract deployed to address:", toon_verse.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });