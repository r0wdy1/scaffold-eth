import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { pinJSONToIPFS } from '../helpers/pinata';
import {
    Form,
    Rate,
    Upload,
    Input,
    Modal,
    Button,
    Space,
} from 'antd';

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 16 },
};

const normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
        return e;
    }

    return e?.fileList;
};

const EndorseModal = ({isModalVisible, setIsModalVisible, sendEndorseTx, candidateAddress, interviewerAddress}) => {
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        const metadata = {
            candidate: {
                name: values.name,
                surname: values.surname,
                position: values.position,
                rate: values.rate,
                address: candidateAddress,
            },
            interviewer: {
                address: interviewerAddress,
            }
        };
        try {
            const tokenURI = await pinJSONToIPFS(JSON.stringify(metadata))
            console.log("Metadata uploaded. URI: ", tokenURI);
            await sendEndorseTx(candidateAddress, tokenURI);
        } catch (e) {
            console.error(`Failed to create nft: ${e}`);
        }
        setIsModalVisible(false);
    };

    const onReset = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal 
            title="Данные кандидата" 
            visible={isModalVisible} 
            onCancel={handleCancel}
            footer={[]}//this to hide the default inputs of the modal
        >
            <Form
                name="validate_other"
                onFinish={onFinish}
                {...formItemLayout}
            >
                <Form.Item
                    label="Имя"
                    name="name"
                    rules={[{ required: true, message: 'Пожалуйста, заполните имя кандидата!' }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    label="Фамилия"
                    name="surname"
                    rules={[{ required: true, message: 'Пожалуйста, заполните фамилию кандидата!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Должность"
                    name="position"
                    rules={[{ required: true, message: 'Пожалуйста, заполните должность кандидата!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Оценка"
                    name="rate"
                    rules={[{ required: true, message: 'Пожалуйста, заполните должность кандидата!' }]}
                >
                    <Rate />
                </Form.Item>

                <Form.Item label="Резюме">
                    <Form.Item name="cv" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <Upload.Dragger name="files">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Отправить
                        </Button> 
                        
                        <Button htmlType="button" onClick={onReset}>
                            Отмена
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>      
    );
};

export default EndorseModal;