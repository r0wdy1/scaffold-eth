import React, { useEffect, useState } from 'react';

import {
    Modal,
    Collapse,
    Card,
    Rate,
    Row,
    Col,
    Typography,
    Spin
} from 'antd';

const { Panel } = Collapse;
const { Text } = Typography;

const CandidateProfileModal = ({isModalVisible, setIsModalVisible, candidateAddress, getCandidateTokens}) => {
    const [candidateTokens, setCandidateTokens] = useState(new Map());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCandidateTokens(new Map());
        setLoading(true);

        const updateTokens = async () => {
            const tokens = await getCandidateTokens(candidateAddress);
            setLoading(false);
            setCandidateTokens(tokens);
        };

        updateTokens();
        const id = setInterval(updateTokens, 10000);
        return () => clearInterval(id);
    }, [candidateAddress])
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    let content;
    if (loading) {
        content = <Spin tip="Загрузка..." />;
    } else {
        content =
            <Collapse>
            {
                Array.from(candidateTokens).map(([tokenId, token]) => {
                    return (
                    <Panel header={`Отзыв от ${token.interviewer.name}`} key={tokenId}>
                        <Card title={`${token.candidate.name} ${token.candidate.surname}`} >
                            <Row align-items="center">
                                <Col span={12}><Text>{token.candidate.position}</Text></Col>
                                <Col span={12}><Rate disabled defaultValue={token.candidate.rate} /></Col>
                            </Row>
                        </Card>
                    </Panel>
                )})
            }
            </Collapse> 
    }

    return (
        <Modal 
            title="Достижения кандидата" 
            visible={isModalVisible} 
            onCancel={handleCancel}
            footer={[]}
        >
            <div style={{ margin: "auto", textAlign: "center" }}>
                {content}
            </div>
        </Modal>      
    );
};

export default CandidateProfileModal;