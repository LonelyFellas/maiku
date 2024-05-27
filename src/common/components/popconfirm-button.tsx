import { Button, Popconfirm } from 'antd';
import { useI18nConfig } from '@/common';

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
  const [lang] = useI18nConfig('config.basic');
  const { title = lang?.cmp_popconfirm_button_title, text = lang?.cmp_popconfirm_button_text, onConfirm, ...rest } = props;

  return (
    <Popconfirm title={title} onConfirm={onConfirm} {...rest}>
      <Button type="link" danger>
        {text}
      </Button>
    </Popconfirm>
  );
}
