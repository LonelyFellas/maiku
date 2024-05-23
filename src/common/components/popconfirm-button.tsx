import { Button, Popconfirm } from 'antd';

interface PopconfirmButtonProps {
  title?: string;
  text?: string;
  onConfirm?: () => void;
}

/**
 * 默认删除的确认button
 * @param props
 * @constructor
 */
export function PopconfirmButton(props: PopconfirmButtonProps) {
  const { title = '确认删除', text = '删除', onConfirm, ...rest } = props;

  return (
    <Popconfirm title={title} onConfirm={onConfirm} {...rest}>
      <Button type="link" danger>
        {text}
      </Button>
    </Popconfirm>
  );
}
