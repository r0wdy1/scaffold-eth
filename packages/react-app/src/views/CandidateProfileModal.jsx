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
    List
} from 'antd';


const CandidateProfileModal = ({isModalVisible, setIsModalVisible, transferEvents, candidateAddress, getCandidateInfo}) => {
    const [tokenURIs, setTokenURIs] = useState(new Map());
    
    const onReset = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // transferEvents.map((item) => {
    //     getCandidateInfo(item.args.tokenId).then((uri) => setTokenURIs(new Map(tokenURIs.set(item.args.tokenId, uri))));
    // })

    return (
        <Modal 
            title="Достижения кандидата" 
            visible={isModalVisible} 
            onCancel={handleCancel}
            footer={[]}//this to hide the default inputs of the modal
        >
            <div style={{ margin: "auto" }}>
                <List
                    bordered
                    dataSource={transferEvents.filter((item) => item.args.to == candidateAddress)}
                    renderItem={ item => {
                        return (
                            <List.Item key={item.blockNumber + "_" + item.args.tokenId}>
                            {BigNumber.from(item.args.tokenId).toString()}
                            {tokenURIs.get(item.args.tokenId)}
                            </List.Item>
                        );
                    }}
                />
            </div>
        </Modal>      
    );
};

export default CandidateProfileModal;