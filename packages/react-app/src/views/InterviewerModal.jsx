import React from "react";
import { Form, Rate, Upload, Input, Modal, Button, Space } from "antd";

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

const normFile = e => {
  console.log("Upload event:", e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

const InterviewerModal = ({ isModalVisible, setIsModalVisible, addInterviewer }) => {
  const onFinish = async values => {
    console.log("Received values of form: ", values);
    // const metadata = {
    //   candidate: {
    //     name: values.name,
    //     surname: values.surname,
    //     position: values.position,
    //     rate: values.rate,
    //     address: candidateAddress,
    //   },
    //   interviewer: {
    //     address: interviewerAddress,
    //   }
    // };
    // const tokenURI = await pinJSONToIPFS(JSON.stringify(metadata))
    // console.log("Metadata uploaded. URI: ", tokenURI);

    await addInterviewer(values.CompanyName, values.LinkToCompany);
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
      title="Данные интервьюера"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[]} //this to hide the default inputs of the modal
    >
      <Form name="validate_other" onFinish={onFinish} {...formItemLayout} labelCol={{ span: 11 }}>
        <Form.Item
          label="Название компании"
          name="CompanyName"
          rules={[{ required: true, message: "Пожалуйста, заполните название компании!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ссылка на сайт компании"
          name="LinkToCompany"
          rules={[{ required: true, message: "Пожалуйста, заполните ссылку на сайт компании!" }]}
        >
          <Input />
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

export default InterviewerModal;
