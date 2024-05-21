import { Modal } from 'antd';

interface PushFilesModalProps extends AntdModalProps {}
const PushFilesModal = (props: PushFilesModalProps) => {
  return <Modal {...props}>Push Files</Modal>;
};
export default PushFilesModal;
