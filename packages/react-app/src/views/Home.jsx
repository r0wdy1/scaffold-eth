import { useContractReader, useUserAddress } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import React from "react";
import { AddressInput, Address, Blockie } from "../components";
import { Button } from "antd";
import { useState } from "react";

import { Col, Row } from "antd";
import EndorseModal from "./EndorseModal";
import CandidateProfileModal from "./CandidateProfileModal";
import { getJSONFromIPFS } from "../helpers/pinata";
import Modal from "../components/Modal";
import ModalContent from "../components/Modal";
import InterviewerModal from "./InterviewerModal";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, address, tx, writeContracts, mainnetProvider, localProvider }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract

  const interviewers = useContractReader(readContracts, "TalentToken", "listInterviewers");
  const candidates = useContractReader(readContracts, "TalentToken", "listCandidates");
  const interviewerRole = "0x6254a434224c7765cc60976b96d4c296321339f8c1d711b8cba8964de4306c78";
  const isAdmin = useContractReader(readContracts, "TalentToken", "hasRole", [
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    address,
  ]);
  const isInterviewer = useContractReader(readContracts, "TalentToken", "hasRole", [interviewerRole, address]);

  console.log("interviewers", interviewers);
  console.log("my address", address);
  console.log(`isAdmin=${isAdmin}, isInterviewer=${isInterviewer}`);

  const [interviewerAddress, setInterviewerAddress] = useState();
  const [candidateAddress, setCandidateAddress] = useState();
  const [isEndorseModalVisible, setIsEndorseModalVisible] = useState(false);
  const [isCandidateProfileModalVisible, setIsCandidateProfileModalVisible] = useState(false);
  const [candidateTokens, setCandidateTokens] = useState(new Map());
  const [candidateInfoAddress, setCandidateInfoAddress] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInterviewerModalVisable, setInterviewerModalVi] = useState(false);

  const User = ({ address, isInterviewer, readContracts }) =>
    address ? (
      <div>
        {/* <Blockie address={address} /> */}
        <Address
          value={address}
          ensProvider={mainnetProvider}
          fontSize={16}
          isInterviewers={isInterviewer}
          readContracts={readContracts}
        />
      </div>
    ) : null;
  const interviewersBoard = (
    <div>
      <h2>Interviewers board</h2>
      {interviewers?.map(address => (
        <User address={address} isInterviewer={true} readContracts={readContracts} />
      ))}
    </div>
  );
  const candidatesBoard = (
    <div>
      <h2>Candidates board</h2>
      {candidates?.map(address => (
        <User address={address} />
      ))}
    </div>
  );

  const txCallBack = update => {
    console.log("📡 Transaction Update:", update);
    if (update && (update.status === "confirmed" || update.status === 1)) {
      console.log(" 🍾 Transaction " + update.hash + " finished!");
      console.log(
        " ⛽️ " +
          update.gasUsed +
          "/" +
          (update.gasLimit || update.gas) +
          " @ " +
          parseFloat(update.gasPrice) / 1000000000 +
          " gwei",
      );
    }
  };
  const sendEndorseTx = async (address, tokenURI) => {
    const result = tx(writeContracts.TalentToken.endorse(address, tokenURI), txCallBack);
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  const endorseCandidate = (
    <div>
      <div style={{ width: 350, padding: 16, margin: "auto" }}>
        <h3>Endorse a candidate</h3>
        <AddressInput onChange={setCandidateAddress} />
        {/* <Rate allowHalf defaultValue={2.5} /> */}
        <Button type="primary" size="large" onClick={() => { setIsEndorseModalVisible(true) }} >Add</Button>
      </div>
    </div>
  );

  const getCandidateTokens = (address, onlyUpdate) => {
    setCandidateTokens(new Map());
    let tokens = new Map();
    readContracts.TalentToken.balanceOf(address)
      .then( tokensCount => {
        console.log(`Tokens count: ${tokensCount}`);
        for (let tokenIndex = 0; tokenIndex < tokensCount; tokenIndex++) {
          readContracts.TalentToken.tokenOfOwnerByIndex(address, tokenIndex)
            .then( tokenId => {
              console.log(tokenId);
              readContracts.TalentToken.tokenURI(tokenId)
              .then( uri => getJSONFromIPFS(uri))
              .then( metadata => {
                tokens = tokens.set(tokenId, metadata);
                setCandidateTokens(tokens);
              })
            })
            .catch( err => console.log(err));
        }
      })
      .catch( err => {
        // nothing to do
      })
  }
  
  const getCandidateInfo = <div>
    <div style={{ width: 350, padding: 16, margin: "auto" }}>
      <h3>Get candidate profile</h3>
      <AddressInput onChange={setCandidateInfoAddress} />
      <Button type="primary" size="large" onClick={() => { getCandidateTokens(candidateInfoAddress); setIsCandidateProfileModalVisible(true) }} >Get</Button>
    </div>
  </div>



  const onAddInterviewer = async (companyName, website) => {
    const result = tx(writeContracts.TalentToken.addInterviewer(interviewerAddress, companyName, website), txCallBack);
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };
  const addInterviewer = (
    <div>
      <div style={{ width: 350, padding: 16, margin: "auto" }}>
        <h3>Add a new interviewer</h3>
        <AddressInput onChange={setInterviewerAddress} />
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setInterviewerModalVi(true);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <h2>
          {" "}
          My current role: {isAdmin ? "Admin" : ""} {isInterviewer ? "interviewer" : ""}
        </h2>
      </div>
      {getCandidateInfo}
      {isAdmin ? addInterviewer : null}
      {isInterviewer ? endorseCandidate : null}
      <EndorseModal 
        isModalVisible={isEndorseModalVisible} 
        setIsModalVisible={setIsEndorseModalVisible} 
        sendEndorseTx={sendEndorseTx} 
        candidateAddress={candidateAddress} 
        interviewerAddress={address}
      />
      <CandidateProfileModal 
        isModalVisible={isCandidateProfileModalVisible} 
        setIsModalVisible={setIsCandidateProfileModalVisible} 
        candidateAddress={candidateAddress}
        candidateTokens={candidateTokens}
      />
      <InterviewerModal
        isModalVisible={isInterviewerModalVisable}
        setIsModalVisible={setInterviewerModalVi}
        addInterviewer={onAddInterviewer}
      />
      <Row>
        <Col span={12}>{interviewersBoard}</Col>
        <Col span={12}>{candidatesBoard}</Col>
      </Row>
    </div>
  );
}

export default Home;
