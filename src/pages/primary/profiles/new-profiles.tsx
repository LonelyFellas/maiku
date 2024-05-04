import { DetailCollapse } from '@common';
import { Button, Form, Input, Space, Modal, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { MacScrollbar } from 'mac-scrollbar';
import { useRouter } from '@tanstack/react-router';

export default function NewProfiles() {
  const { history } = useRouter();
  const inputStyle = { width: '240px' };

  const handleCancel = () => {
    Modal.confirm({
      title: '取消确认框',
      icon: <ExclamationCircleOutlined />,
      content: '确认要退出新建环境吗？取消后将不会保存已编辑内容',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        history.go(-1);
      },
    });
  };

  return (
    <div className="flex flex-col h-full rounded-md p-4">
      <MacScrollbar className="flex-1">
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <h1 className="font-bold border-b-[1px] pl-3 py-1 rounded-sm mb-6">
            基础信息:
          </h1>
          <Form.Item label="环境名称">
            <Input placeholder="请输入环境名称" style={inputStyle} />
          </Form.Item>
          {/*<h1 className={titleStyle}>云手机信息:</h1>*/}

          <DetailCollapse>
            <DetailCollapse.Panel header="云手机代理" key="1">
              <Form.Item label="安卓镜像版本">
                <Input placeholder="请输入安卓镜像版本" style={inputStyle} />
              </Form.Item>
              <Form.Item label="存储空间大小">
                <Input placeholder="请输入存储空间大小" style={inputStyle} />
              </Form.Item>
              <Form.Item label="内存大小">
                <Input placeholder="请输入内存大小" style={inputStyle} />
              </Form.Item>
              <Form.Item label="分辨率">
                <Input placeholder="请输入分辨率" style={inputStyle} />
              </Form.Item>
            </DetailCollapse.Panel>
          </DetailCollapse>
          <DetailCollapse>
            <DetailCollapse.Panel header="VPC代理" key="1">
              <Form.Item label="服务器地址">
                <Input placeholder="请输入服务器地址" style={inputStyle} />
              </Form.Item>
              <Form.Item label="端口地址">
                <Input placeholder="请输入端口地址" style={inputStyle} />
              </Form.Item>
              <Form.Item label="用户名">
                <Input placeholder="请输入用户名" style={inputStyle} />
              </Form.Item>
              <Form.Item label="密码">
                <Input placeholder="请输入密码" style={inputStyle} />
              </Form.Item>
            </DetailCollapse.Panel>
          </DetailCollapse>
        </Form>
      </MacScrollbar>
      <Divider className="mt-0 my-4" />
      <Space>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary">确定</Button>
      </Space>
    </div>
  );
}
