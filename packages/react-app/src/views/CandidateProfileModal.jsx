import React from 'react';

import {
    Modal,
    Collapse,
} from 'antd';

const { Panel } = Collapse;

const CandidateProfileModal = ({isModalVisible, setIsModalVisible, candidateTokens}) => {
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
                    {Array.from(candidateTokens).map(([tokenId, token]) => {
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