const { ethers } = require("hardhat");
const { use, expect, assert } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myTokenContract;



  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });


  let admin, interviewer, candidate;

  before(async function () {
    [admin, interviewer, candidate] = await ethers.getSigners();
    console.log("[admin, interviewer, candidate]", admin.address, interviewer.address, candidate.address)
    console.log("Deploying TalentToken");
    const TalentToken = await ethers.getContractFactory("TalentToken");
    myTokenContract = await TalentToken.deploy(admin.address);
    console.log("TalentToken address", myTokenContract.address);
  });


  
  
  const interviewerRole = "0x6254a434224c7765cc60976b96d4c296321339f8c1d711b8cba8964de4306c78";


  describe("TalentToken", function () {
    it("should grant role to interviewer", async function () {



      expect(await myTokenContract.grantRole(interviewerRole, interviewer.address))
        .to
        .emit(myTokenContract, "RoleGranted").withArgs(interviewerRole, interviewer.address, admin.address)

      expect(await myTokenContract.hasRole(interviewerRole, interviewer.address)).to.be.equal(true);

      expect((await myTokenContract.listInterviewers()).length).to.be.equal(1);

    })

    it("should allow an interviewer to endorse candidate", async function () {

      expect(await myTokenContract.hasRole(interviewerRole, interviewer.address)).to.be.equal(true);

      const tokenUri = "foobar";
      await myTokenContract.connect(interviewer).getRoleAdmin(interviewerRole);
      expect(await myTokenContract.connect(interviewer).endorse(candidate.address, tokenUri))
        .to
        .emit(myTokenContract, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", candidate.address, 0); //Transfer(address(0), to, tokenId);

      expect(await myTokenContract.balanceOf(candidate.address)).to.be.equal(1);
      expect(await myTokenContract.ownerOf(0)).to.be.equal(candidate.address);
      expect((await myTokenContract.listCandidates()).length).to.be.equal(1);
    })
  });
});
