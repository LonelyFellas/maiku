import { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Space,
  Modal,
  Divider,
  Radio,
  Select,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { MacScrollbar } from 'mac-scrollbar';
import { useRouter } from '@tanstack/react-router';
import { DetailCollapse } from '@common';
import './style.css';
import { AddProxyFormItems } from '@/pages/discover/proxy/modules/edit.tsx';

type ProxyType = 'custom' | 'list';
const inputStyle = { width: '240px' };
export default function NewProfiles() {
  const { history } = useRouter();
  const [form] = Form.useForm();
  const [proxyType, setProxyType] = useState<ProxyType>('custom');

  const handleProxyTypeChange = ({
    formProxyType,
  }: {
    formProxyType: ProxyType;
  }) => {
    console.log(formProxyType);
    setProxyType(formProxyType);
  };

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
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onValuesChange={handleProxyTypeChange}
          initialValues={{
            formProxyType: 'custom',
            proxyType: 'socks5',
          }}
        >
          <h1 className="font-bold border-b-[1px] pl-3 py-1 rounded-sm mb-6 pb-3">
            基础信息:
          </h1>
          <Form.Item label="环境名称" className="mb-4">
            <Input placeholder="请输入环境名称" style={inputStyle} />
          </Form.Item>
          {/*<h1 className={titleStyle}>云手机信息:</h1>*/}

          <DetailCollapse
            defaultActiveKey={['1']}
            items={[
              {
                label: '云手机代理:',
                key: '1',
                children: (
                  <>
                    <Form.Item label="安卓镜像版本" className="mt-4">
                      <Input
                        placeholder="请输入安卓镜像版本"
                        style={inputStyle}
                      />
                    </Form.Item>
                    <Form.Item label="存储空间大小">
                      <Input
                        placeholder="请输入存储空间大小"
                        style={inputStyle}
                      />
                    </Form.Item>
                    <Form.Item label="内存大小">
                      <Input placeholder="请输入内存大小" style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      label="分辨率"
                      className="new_profiles_compact h-[32px] mb-0"
                    >
                      <Space.Compact>
                        <Form.Item className="w-20">
                          <Input placeholder="宽度" />
                        </Form.Item>
                        <Form.Item className="w-20">
                          <Input placeholder="高度" />
                        </Form.Item>
                        <Form.Item className="w-20">
                          <Input placeholder="像素" />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>
                  </>
                ),
              },
            ]}
          />
          <DetailCollapse
            defaultActiveKey={['1']}
            items={[
              {
                label: 'VPC代理:',
                key: '1',
                children: (
                  <>
                    <Form.Item
                      label="代理方式"
                      className="mt-4"
                      name="formProxyType"
                    >
                      <Radio.Group value={proxyType}>
                        <Radio.Button value="custom">自定义</Radio.Button>
                        <Radio.Button value="list">已添加的代理</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    {proxyType === 'custom' ? (
                      <AddProxyFormItems />
                    ) : (
                      <Form.Item label="选择代理" name="proxyList">
                        <Select
                          className="!w-[240px]"
                          placeholder="请选择代理类型"
                          options={[]}
                        />
                      </Form.Item>
                    )}
                  </>
                ),
              },
            ]}
          />
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
