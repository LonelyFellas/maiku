import type React from 'react';
import { Modal as AntdModal, type ModalProps } from 'antd';
import './index.css';

/**
 * 加了一些modal的项目统一样式
 * 其他的和antd的modal用法一致
 * @param props
 * @constructor
 */
const Modal = (props: React.PropsWithChildren<ModalProps>) => (
  <AntdModal
    className="general-maiku-modal border-gray-100"
    styles={{
      header: {
        padding: '0px 0px 10px 0px',
        marginTop: -10,
        marginBottom: 20,
        borderBottom: '1px solid rgb(243 244 246 / var(--tw-border-opacity))',
      },
      footer: {
        paddingTop: 10,
        marginBottom: -10,
        borderTop: '1px solid rgb(243 244 246 / var(--tw-border-opacity))',
      },
    }}
    {...props}
  />
);
export default Modal;
