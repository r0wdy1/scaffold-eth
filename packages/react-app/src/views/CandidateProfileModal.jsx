import React from 'react';

import {
    Modal,
    Collapse,
    Card,
    Rate,
    Row,
    Col,
    Typography
} from 'antd';

const { Panel } = Collapse;
const { Text } = Typography;

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
                            <Card title={`${token.candidate.name} ${token.candidate.surname}`} >
                                <Row align-items="center">
                                    <Col span={12}><Text>{token.candidate.position}</Text></Col>
                                    <Col span={12}><Rate disabled defaultValue={token.candidate.rate} /></Col>
                                </Row>
                            </Card>
                        </Panel>);
                    })}
                </Collapse>
            </div>
        </Modal>      
    );
};

export default CandidateProfileModal;