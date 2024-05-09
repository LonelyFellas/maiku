import { InputNumber, Form, Radio, Space } from 'antd';
import type { PXType } from '@/pages/layout/new-profiles.tsx';

/**
 * 新增环境的 form-item 分辨率
 * @param props 包含 resType 的 props
 * @property props.pxType 环境类型 custom 自定义，auto-720 自动 720P，auto-1080 自动 1080P
 */
const Resolution = (props: { pxType: PXType }) => {
  return (
    <Form.Item className="resolution" name="px_type">
      <div className="flex gap-4">
        <Radio.Group value={props.pxType}>
          <Radio.Button value={1}>720P</Radio.Button>
          <Radio.Button value={2}>1080P</Radio.Button>
          <Radio.Button value={100}>自定义</Radio.Button>
        </Radio.Group>
        {props.pxType === 100 ? (
          <Space.Compact>
            <Form.Item name="width" className="w-20">
              <InputNumber placeholder="宽度" />
            </Form.Item>
            <Form.Item name="height" className="w-20">
              <InputNumber placeholder="高度" />
            </Form.Item>
            <Form.Item name="dpi" className="w-20">
              <InputNumber placeholder="像素" />
            </Form.Item>
          </Space.Compact>
        ) : null}
      </div>
    </Form.Item>
  );
};

export default Resolution;
