import { useContractReader, useUserAddress } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { AddressInput, Address, Blockie } from "../components";
import { Button } from 'antd';
import { useState } from "react";
import { Rate } from 'antd';

import { Col, Row } from 'antd';
import EndorseForm from "./EndorseForm";
import Modal from "../components/Modal";
import ModalContent from "../components/Modal";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, address, tx, writeContracts, mainnetProvider }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract

  const interviewers = useContractReader(readContracts, "TalentToken", "listInterviewers");
  const candidates = useContractReader(readContracts, "TalentToken", "listCandidates");
  const interviewerRole = "0x6254a434224c7765cc60976b96d4c296321339f8c1d711b8cba8964de4306c78";
  const isAdmin = useContractReader(readContracts, "TalentToken", "hasRole", ["0x0000000000000000000000000000000000000000000000000000000000000000", address]);
  const isInterviewer = useContractReader(readContracts, "TalentToken", "hasRole", [interviewerRole, address]);

  console.log("interviewers", interviewers);
  console.log("my address", address);
  console.log(`isAdmin=${isAdmin}, isInterviewer=${isInterviewer}`);



  const [interviewerAddress, setInterviewerAddress] = useState();
  const [candidateAddress, setCandidateAddress] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const User = ({ address }) => (

    address ?
      <div>
        {/* <Blockie address={address} /> */}
        <Address value={address} ensProvider={mainnetProvider} fontSize={16} />
      </div>
      : null

  )
  const interviewersBoard = <div>
    <h2>Interviewers board</h2>
    {interviewers?.map(address => <User address={address} />)}
  </div>
  const candidatesBoard = <div>
    <h2>Candidates board</h2>
    {candidates?.map(address => <User address={address} />)}
  </div>


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
  const sendEndorseTx = async (candidate) => {
    const result = tx(writeContracts.TalentToken.endorse(candidateAddress, "token URI"), txCallBack);
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  }


  const endorseCandidate =
    <div>
      <div style={{ width: 350, padding: 16, margin: "auto" }}>

        <h3>Endorse a candidate</h3>
        <AddressInput onChange={setCandidateAddress} />
        {/* <Rate allowHalf defaultValue={2.5} /> */}
        <Button type="primary" size="large" onClick={() => { setIsModalVisible(true) }} >Add</Button>



      </div>
    </div>




  const onAddInterviewer = async () => {
    const result = tx(writeContracts.TalentToken.grantRole(interviewerRole, interviewerAddress), txCallBack);
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);

  }
  const addInterviewer = <div>
    <div style={{ width: 350, padding: 16, margin: "auto" }}>

      <h3>Add a new interviewer</h3>
      <AddressInput onChange={setInterviewerAddress} />
      <Button type="primary" size="large" onClick={onAddInterviewer} >Add</Button>
    </div>
  </div>




  return (

    <div>
      <div>
        <h2> My current role: {isAdmin ? 'Admin' : ''} {isInterviewer ? 'interviewer' : ''}</h2>
      </div>
      {isAdmin ? addInterviewer : null}
      {isInterviewer ? endorseCandidate : null}
      <ModalContent
        content={<EndorseForm sendEndorseTx={sendEndorseTx} address={candidateAddress} />}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible} />
      <Row>
        <Col span={12}>{interviewersBoard}</Col>
        <Col span={12}>{candidatesBoard}</Col>
      </Row>

    </div>

  );
}

export default Home;
