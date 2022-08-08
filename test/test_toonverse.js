const ToonVerse = artifacts.require("ToonVerse");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ToonVerse", function (accounts) {
  it("should support the ERC721 and ERC2198 standards", async () => {
    const toonVerseInstance = await ToonVerse.deployed();
    const ERC721InterfaceId = "0x80ac58cd";
    const ERC2981InterfaceId = "0x2a55205a";
    var isERC721 = await toonVerseInstance.supportsInterface(ERC721InterfaceId);
    var isER2981 = await toonVerseInstance.supportsInterface(ERC2981InterfaceId); 
    assert.equal(isERC721, true, "ToonVerse is not an ERC721");
    assert.equal(isER2981, true, "ToonVerse is not an ERC2981");
  });
  it("should return the correct royalty info when specified and burned", async () => {
    const toonVerseInstance = await ToonVerse.deployed();
    await toonVerseInstance.mintNFT(accounts[0], "fakeURI");
    // Override royalty for this token to be 10% and paid to a different account
    await toonVerseInstance.mintNFTWithRoyalty(accounts[0], "fakeURI", accounts[1], 1000);

    const defaultRoyaltyInfo = await toonVerseInstance.royaltyInfo.call(1, 1000);
    var tokenRoyaltyInfo = await toonVerseInstance.royaltyInfo.call(2, 1000);
    const owner = await toonVerseInstance.owner.call();
    assert.equal(defaultRoyaltyInfo[0], owner, "Default receiver is not the owner");
    // Default royalty percentage taken should be 5%. 
    assert.equal(defaultRoyaltyInfo[1].toNumber(), 50, "Royalty fee is not 50");
    assert.equal(tokenRoyaltyInfo[0], accounts[1], "Royalty receiver is not a different account");
    // Default royalty percentage taken should be 5%. 
    assert.equal(tokenRoyaltyInfo[1].toNumber(), 100, "Royalty fee is not 100");

    // Royalty info should be set back to default when NFT is burned
    await toonVerseInstance.burnNFT(2);
    tokenRoyaltyInfo = await toonVerseInstance.royaltyInfo.call(2, 1000);
    assert.equal(tokenRoyaltyInfo[0], owner, "Royalty receiver has not been set back to default");
    assert.equal(tokenRoyaltyInfo[1].toNumber(), 50, "Royalty has not been set back to default");
  });
});
