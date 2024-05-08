import { useState } from 'react';
import { App, Button, Divider, Form, Input, InputNumber, Radio, Space } from 'antd';
import { Scrollbar } from '@darwish/scrollbar-react';
import { isUndef } from '@darwish/utils-is';
import { useMutation } from '@tanstack/react-query';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useParams, useRouter } from '@tanstack/react-router';
import { DetailCollapse, onlyTrueObj } from '@common';
import { AddProxyFormItems } from '@/pages/discover/proxy/modules/add-proxy-common-formitem.tsx';
import { postAddEnvService } from '@api/primary/env.ts';
import GetProxyView from './modules/get-proxy-view';
import Resolution from './modules/resolution';
import './style.css';
import type { PostAddEnvParams } from '@api/primary/type.ts';

type ProxyType = 'custom' | 'list';
type ResType = 'auto-720' | 'auto-1080' | 'custom';
type IForm = PostAddEnvParams & { formProxyType: ProxyType; resolution: ResType };
const inputStyle = { width: '240px' };
export default function NewProfiles() {
  const { modal } = App.useApp();
  const { id } = useParams({ from: `/layout/new_profiles/$id` });
  const isEdit = id !== '-1';
  const { history } = useRouter();
  const [form] = Form.useForm<IForm>();
  const [proxyType, setProxyType] = useState<ProxyType>('custom');
  const [resType, setResType] = useState<ResType>('auto-720');

  const mutation = useMutation({
    mutationFn: postAddEnvService,
    mutationKey: ['add-edit-env'],
    onSuccess: () => {
      modal.confirm({
        title: '新建环境成功',
        content: '新建环境成功, 是否继续添加环境？',
        okText: '继续添加',
        cancelText: '返回',
        onOk: () => {
          form.resetFields();
        },
        onCancel: () => {
          history.go(-1);
        },
      });
    },
  });

  const handleProxyTypeChange = (values: IForm) => {
    const { formProxyType, resolution, width, height, dpi } = values;
    if (!isUndef(width) || !isUndef(height) || !isUndef(dpi)) {
      setResType('custom');
    } else if (['custom', 'auto-720', 'auto-1080'].includes(resolution)) {
      setResType(resolution);
    }
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

  /** 过滤一些不需要的字段 **/
  const filterFormValues = (values: IForm) => {
    const { formProxyType, resolution, ...rest } = values;
    if (resolution === 'auto-720') {
      rest.width = 720;
      rest.height = 1080;
      rest.dpi = 320;
    } else if (resolution === 'auto-1080') {
      rest.width = 1080;
      rest.height = 1920;
      rest.dpi = 480;
    }
    return rest;
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const filteredValues = filterFormValues(values);
    mutation.mutate(filteredValues);
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
            ...onlyTrueObj(!isEdit, { type: '1' }),
            formProxyType: 'custom',
            resolution: 'auto-720',
          }}
        >
          <h1 className="font-bold border-b-[1px] pl-3 py-1 rounded-sm mb-6 pb-3">基础信息:</h1>
          <Form.Item label="环境名称" name="name" className="mb-4" required rules={[{ required: true, message: '请输入环境名称' }]}>
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
                    <Form.Item label="存储空间大小" name="disk" className="mt-4">
                      <InputNumber placeholder="请输入存储空间大小" style={inputStyle} />
                    </Form.Item>
                    <Form.Item label="内存大小" name="memory">
                      <InputNumber placeholder="请输入内存大小" style={inputStyle} />
                    </Form.Item>
                    <Form.Item label="分辨率" className="new_profiles_compact h-[32px] mb-0">
                      <Resolution resType={resType} />
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
                      <Form.Item label="代理方式" className="mt-4" name="formProxyType">
                        <Radio.Group value={proxyType}>
                          <Radio.Button value="custom">自定义</Radio.Button>
                          <Radio.Button value="list">已添加的代理</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    ) : null}
                    {/*
                     *  只有在新增环境 才能自定义代理
                     */}
                    {!isEdit && proxyType === 'custom' ? <AddProxyFormItems /> : <GetProxyView />}
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
        <Button type="primary" onClick={handleSubmit} loading={mutation.isPending}>
          确定
        </Button>
      </Space>
    </div>
  );
}
