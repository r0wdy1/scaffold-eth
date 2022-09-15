import { Button, Modal } from 'antd';
import React, { useState } from 'react';

const ModalContent = ({content, isModalVisible, setIsModalVisible}) => {
  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {content}
      </Modal>
    </>
  );
};

export default ModalContent;