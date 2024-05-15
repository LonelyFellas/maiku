import { InputNumber, Form, Radio, Space } from 'antd';
import type { PXType } from '@/pages/layout/new-profiles.tsx';
import { useI18nConfig } from '/src/common';

/**
 * 新增环境的 form-item 分辨率
 * @param props 包含 resType 的 props
 * @property props.pxType 环境类型 custom 自定义，auto-720 自动 720P，auto-1080 自动 1080P
 */
const Resolution = (props: { pxType: PXType }) => {
  const [lang] = useI18nConfig('config.new_profiles');
  return (
    <Form.Item className="resolution" name="px_type_super">
      <div className="flex gap-4">
        <Form.Item name="px_type">
          <Radio.Group value={props.pxType}>
            <Radio.Button value="1">720P</Radio.Button>
            <Radio.Button value="2">1080P</Radio.Button>
            <Radio.Button value="100">{lang.form_title2_item3DPI_diy}</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {props.pxType === '100' ? (
          <Space.Compact>
            <Form.Item name="width" className="w-20">
              <InputNumber placeholder={lang.form_title2_item3DPI_width} />
            </Form.Item>
            <Form.Item name="height" className="w-20">
              <InputNumber placeholder={lang.form_title2_item3DPI_height} />
            </Form.Item>
            <Form.Item name="dpi" className="w-20">
              <InputNumber placeholder={lang.form_title2_item3DPI_dpi} />
            </Form.Item>
          </Space.Compact>
        ) : null}
      </div>
    </Form.Item>
  );
};

export default Resolution;
