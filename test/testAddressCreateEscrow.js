const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');


describe('AddressCreateEscrow', function () {
    async function deployContractAndSetVariables() {
      const Escrow = await ethers.getContractFactory('AddressCreateEscrow');
      const escrow = await Escrow.deploy();
  
      return { escrow };
    }
  
    it('should be a winner', async function () {
      // leave this as-is
      const { escrow } = await loadFixture(deployContractAndSetVariables);
  
      await escrow.saveEscorw('0xB5e94cD179848873a1B19E278e0A556f2dbb1bb3', '0xAC8c4642E76ECEFb545D0F9388A4AB9b01d82044', '0x5eD19EB47290876E9D1584cc39F7d1Ee39D19875', 1)
      await escrow.saveEscorw('0xc68f812dFa8219A075cF4965551AdF4F6750bd2B', '0xAC8c4642E76ECEFb545D0F9388A4AB9b01d82044', '0x5eD19EB47290876E9D1584cc39F7d1Ee39D19875', 1)
      const addr = await escrow.getEscrowByaddress();
  
     console.log(addr);
      
  
      // leave this testing assertion as-is
    //   assert(await game.isWon(), 'You did not win the game');
    });
  });
