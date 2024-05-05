import { Modal, type ModalProps } from 'antd';

interface EditProps extends ModalProps {

}

const Edit = (props: EditProps) => {

  return (
    <Modal {...props}>
      <h1>111</h1>
    </Modal>
  );
};
export default Edit;
