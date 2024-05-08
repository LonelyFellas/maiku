import { InputNumber, Form, Radio, Space } from 'antd';

/**
 * 新增环境的 form-item 分辨率
 * @param props 包含 resType 的 props
 * @property props.resType 环境类型 custom 自定义，auto-720 自动 720P，auto-1080 自动 1080P
 */
const Resolution = (props: { resType: string }) => {
  return (
    <Form.Item className="resolution" name="resolution">
      <div className="flex gap-4">
        <Radio.Group value={props.resType}>
          <Radio.Button value="auto-720">720P</Radio.Button>
          <Radio.Button value="auto-1080">1080P</Radio.Button>
          <Radio.Button value="custom">自定义</Radio.Button>
        </Radio.Group>
        {props.resType === 'custom' ? (
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
