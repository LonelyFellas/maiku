import {
  Form,
  type ModalProps,
  Input,
  Select,
  Tag,
  Space,
  InputNumber,
} from 'antd';
import { Modal } from '@common';

interface EditProps extends ModalProps {}

interface FormValues {
  order?: number;
  proxyType: string;
  ip: string;
  username: string;
  password: string;
}

const Item = Form.Item;
const Edit = (props: EditProps) => {
  const { onOk, ...restProps } = props;
  const isAdd = props.title === '添加代理';
  const [form] = Form.useForm<FormValues>();

  const handleOk = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    const validRes = await form.validateFields();
    console.log(validRes);
    onOk?.(event);
  };
  return (
    <Modal {...restProps} width={700} onOk={handleOk}>
      <Form
        form={form}
        className="w-[500px] m-auto"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          proxyType: 'socks5',
        }}
      >
        {!isAdd ? (
          <Item label="代理" name="order">
            <Tag color="blue">123456</Tag>
          </Item>
        ) : null}
        <AddProxyFormItems />
      </Form>
    </Modal>
  );
};
export default Edit;

export function AddProxyFormItems() {
  return (
    <>
      <Item
        label="代理类型"
        name="proxyType"
        required
        rules={[{ required: true, message: '请输入代理类型' }]}
      >
        <Select
          className="!w-[240px]"
          options={[
            { label: 'Socks5', value: '1' },
            { label: 'Http', value: '2', disabled: true },
            { label: 'Https', value: '3', disabled: true },
          ]}
          placeholder="请选择代理类型"
        />
      </Item>
      {/*<Item label="代理查询渠道" name="queryChannel">*/}
      {/*  <Select*/}
      {/*    options={[*/}
      {/*      { label: 'IP2Location', value: 'IP2Location' },*/}
      {/*      { label: 'ip-api', value: 'ip-api' },*/}
      {/*    ]}*/}
      {/*    placeholder="请选择代理查询渠道"*/}
      {/*  />*/}
      {/*</Item>*/}
      <Item label="主机 : 端口" style={{ height: '32px' }} required>
        <Space.Compact className="w-[240px]">
          <Item
            name="address"
            required
            rules={[{ required: true, message: '请输入主机' }]}
          >
            <Input name="port" placeholder="请输入主机" />
          </Item>
          <Item
            name="port"
            required
            rules={[{ required: true, message: '请输入端口' }]}
          >
            <InputNumber addonBefore=":" placeholder="请输入端口" />
          </Item>
        </Space.Compact>
      </Item>
      <Item label="代理账号" name="username">
        <Input className="w-[240px]" placeholder="请输入代理账号" />
      </Item>
      <Item label="代理密码" name="password">
        <Input.Password className="w-[240px]" placeholder="请输入代理密码" />
      </Item>
      <Item label="备注" name="detail">
        <Input.TextArea
          className="!w-[240px]"
          placeholder="请输入备注"
          style={{ resize: 'none' }}
        />
      </Item>
    </>
  );
}
