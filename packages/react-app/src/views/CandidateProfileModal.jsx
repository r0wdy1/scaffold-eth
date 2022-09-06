import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { pinJSONToIPFS } from '../helpers/pinata';
import {BigNumber} from "ethers"
import { useState } from "react";

import {
    Form,
    Rate,
    Upload,
    Input,
    Modal,
    Button,
    Space,
    List,
    Collapse,
} from 'antd';

const { Panel } = Collapse;

const CandidateProfileModal = ({isModalVisible, setIsModalVisible, transferEvents, candidateAddress, candidateTokens, tokens}) => {
    const onReset = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal 
            title="Достижения кандидата" 
            visible={isModalVisible} 
            onCancel={handleCancel}
            footer={[]}//this to hide the default inputs of the modal
        >
            <div style={{ margin: "auto" }}>
                <Collapse>
                    {candidateTokens.filter(tokenId => tokens.get(tokenId) !== undefined).map(tokenId => {
                        const token = tokens.get(tokenId);
                        console.log(token);
                        return (<Panel header={`Token from ${token.interviewer.address}`} key={tokenId}>
                            <p>{token.candidate.name}</p>
                            <p>{token.candidate.surname}</p>
                            <p>{token.candidate.position}</p>
                            <p>{token.candidate.rate}</p>
                        </Panel>);
                    })}
                </Collapse>
            </div>
        </Modal>      
    );
};

export default CandidateProfileModal;