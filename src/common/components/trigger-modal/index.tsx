import React, {
  useState,
  isValidElement,
  cloneElement,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react';
import { Button, type ModalProps } from 'antd';
import { isReactFragment } from '@common';

function isJSX(element: unknown): element is JSX.Element {
  return isValidElement(element);
}

interface CustomModalProps {
  title?: string;
  renderModal: (
    params: Pick<ModalProps, 'title' | 'onCancel' | 'open'> & {
      onOk: <T>(event?: React.MouseEvent<HTMLElement, MouseEvent> | T) => void;
      onCancel: <T>(event?: React.MouseEvent<HTMLElement, MouseEvent> | T) => void;
    },
  ) => JSX.Element;
  isDoubleClick?: boolean;
  isClick?: boolean;
}

/**
 * 触发模态框的组件，内部管理模态框的状态
 * @param props
 * @param props.title 模态框标题
 * @param props.renderModal 渲染模态框的函数
 * @param props.isDoubleClick 是否双击触发
 * @returns
 */
const TriggerModal: FC<PropsWithChildren<CustomModalProps>> = (props) => {
  const {
    title,
    isDoubleClick = false,
    renderModal,
    children,
    isClick = true,
  } = props;
  const [open, setOpen] = useState(false);
  const onCancel = () => {
    setOpen(false);
  };
  const onOk = () => {
    setOpen(false);
  };
  const RenderModal = () => renderModal({ open, onCancel, title, onOk });

  const RenderView = useMemo(() => {
    const handleClick = (eventType: 'onDoubleClick' | 'onClick') => {
      try {
        if (isJSX(children) && children.props && eventType in children.props) {
          children.props[eventType](() => {
            setOpen(true);
          });
        }
      } catch (error) {
        throw new Error(error as string);
      }
      setOpen(true);
    };
    if (!isValidElement(children) || isReactFragment(children)) {
      return <Button onClick={() => setOpen(true)}>{children}</Button>;
    }
    return cloneElement(
      children as JSX.Element,
      isDoubleClick
        ? {
          onDoubleClick: () => handleClick('onDoubleClick'),
        }
        : isClick
          ? {
            onClick: () => handleClick('onClick'),
          }
          : {
            onClick: () => {
              console.log('不可点击');
            },
          },
    );
  }, [children, isDoubleClick]);

  return (
    <>
      {RenderView}
      <RenderModal />
    </>
  );
};
export default TriggerModal;
