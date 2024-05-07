import { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Space,
  Divider,
  Radio,
  Select,
  App,
  InputNumber,
} from 'antd';
import { Scrollbar } from '@darwish/scrollbar-react';
import { isUndef } from '@darwish/utils-is';
import { useMutation } from '@tanstack/react-query';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useParams, useRouter } from '@tanstack/react-router';
import { DetailCollapse, onlyTrueObj } from '@common';
import './style.css';
import { AddProxyFormItems } from '@/pages/discover/proxy/modules/edit.tsx';
import { postAddEnvService } from '@api/primary/env.ts';
import { getProxyList } from '@api/discover/proxy.ts';

type ProxyType = 'custom' | 'list';
const inputStyle = { width: '240px' };
export default function NewProfiles() {
  const { modal } = App.useApp();
  const { id } = useParams({ from: `/layout/new_profiles/$id` });
  const isEdit = id !== '-1';
  const { history } = useRouter();
  const [form] = Form.useForm();
  const [proxyType, setProxyType] = useState<ProxyType>('custom');

  const mutation = useMutation({
    mutationFn: postAddEnvService,
    onSuccess: () => {
      modal.success({
        title: '新建环境成功',
        content: '新建环境成功, 是否继续添加环境？',
        onOk: () => {
          form.resetFields();
        },
        onCancel: () => {
          history.go(-1);
        },
      });
    },
  });

  const handleProxyTypeChange = ({
    formProxyType,
  }: {
    formProxyType: ProxyType;
  }) => {
    console.log(formProxyType);
    if (!isUndef(formProxyType)) {
      setProxyType(formProxyType);
    }
  };

  const handleCancel = () => {
    modal.confirm({
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

  const handleSubmit = async () => {
    const values = await form.validateFields();
    console.log(values);
    mutation.mutate(values);
  };

  return (
    <div className="flex flex-col h-full rounded-md p-4">
      <Scrollbar className="flex-1">
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onValuesChange={handleProxyTypeChange}
          initialValues={{
            ...onlyTrueObj(isEdit, { formProxyType: 'custom' }),
            proxyType: '1',
          }}
        >
          <h1 className="font-bold border-b-[1px] pl-3 py-1 rounded-sm mb-6 pb-3">
            基础信息:
          </h1>
          <Form.Item
            label="环境名称"
            name="name"
            className="mb-4"
            required
            rules={[{ required: true, message: '请输入环境名称' }]}
          >
            <Input placeholder="请输入环境名称" style={inputStyle} />
          </Form.Item>
          {/*<h1 className={titleStyle}>云手机信息:</h1>*/}

          <DetailCollapse
            defaultActiveKey={['1']}
            items={[
              {
                label: '云手机信息:',
                key: '1',
                children: (
                  <>
                    <Form.Item
                      label="存储空间大小"
                      name="disk"
                      className="mt-4"
                    >
                      <InputNumber
                        placeholder="请输入存储空间大小"
                        style={inputStyle}
                      />
                    </Form.Item>
                    <Form.Item label="内存大小" name="memory">
                      <InputNumber
                        placeholder="请输入内存大小"
                        style={inputStyle}
                      />
                    </Form.Item>
                    <Form.Item
                      label="分辨率"
                      className="new_profiles_compact h-[32px] mb-0"
                    >
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
                    {!isEdit ? (
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
                    ) : null}
                    {/*
                     *  只有在新增环境 才能自定义代理
                     */}
                    {!isEdit && proxyType === 'custom' ? (
                      <AddProxyFormItems />
                    ) : (
                      <GetProxyView />
                    )}
                  </>
                ),
              },
            ]}
          />
        </Form>
      </Scrollbar>
      <Divider className="mt-0 my-4" />
      <Space>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>
          确定
        </Button>
      </Space>
    </div>
  );
}

function GetProxyView() {
  const mutation = useMutation({
    mutationFn: getProxyList,
  });

  const handleDropdownVisibleChange = (visible: boolean) => {
    if (visible) {
      console.log('visible', visible);
      mutation.mutate();
    }
  };
  return (
    <Form.Item label="选择代理" name="proxyList">
      <Select
        loading={mutation.isPending}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        className="!w-[240px]"
        placeholder="请选择代理类型"
        options={[]}
      />
    </Form.Item>
  );
}
