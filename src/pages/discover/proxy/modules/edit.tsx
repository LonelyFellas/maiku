import { Form, type ModalProps, Input, Select, Tag } from 'antd';
import { Modal } from '@common';

interface EditProps extends ModalProps {}

const Item = Form.Item;
const Edit = (props: EditProps) => {
  return (
    <Modal {...props} width={700}>
      <Form
        className="w-[500px] m-auto"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Item label="代理" name="order">
          <Tag color="blue">123456</Tag>
        </Item>
        <Item
          label="代理类型"
          name="proxyType"
          required
          rules={[{ required: true, message: '请输入代理类型' }]}
        >
          <Select
            options={[
              { label: 'Socks5', value: 'socks5' },
              { label: 'Http', value: 'http' },
              { label: 'Https', value: 'https' },
            ]}
            placeholder="请选择代理类型"
          />
        </Item>
        <Item label="代理查询渠道" name="queryChannel">
          <Select
            options={[
              { label: 'IP2Location', value: 'IP2Location' },
              { label: 'ip-api', value: 'ip-api' },
            ]}
            placeholder="请选择代理查询渠道"
          />
        </Item>
        <Item label="主机 : 端口" name="ip">
          <Input placeholder="请输入主机:端口" />
        </Item>
        <Item label="代理账号" name="username">
          <Input placeholder="请输入代理账号" />
        </Item>
        <Item label="代理密码" name="password">
          <Input.Password placeholder="请输入代理密码" />
        </Item>
      </Form>
    </Modal>
  );
};
export default Edit;
