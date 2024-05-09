import { useEffect, useState } from 'react';
import { App, Button, Divider, Form, Input, InputNumber, Radio, Space } from 'antd';
import { Scrollbar } from '@darwish/scrollbar-react';
import { isObject, isUndef } from '@darwish/utils-is';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DetailCollapse, onlyTrueObj, toNumber } from '@common';
import { AddProxyFormItems } from '@/pages/discover/proxy/modules/add-proxy-common-formitem.tsx';
import { getEnvByIdService, postAddEnvService, getProxyListService, type GetAllEnvListResult, type PostAddEnvParams } from '@api';
import GetProxyView from './modules/get-proxy-view';
import Resolution from './modules/resolution';
import './style.css';

type ProxyType = 'custom' | 'list';
/**
 * 后端字段 px-type
 * * 1 -> auto-720
 * * 2 -> auto-1080
 * * 100 -> custom
 */
export type PXType = GetAllEnvListResult['px_type'];
type IForm = PostAddEnvParams & { formProxyType: ProxyType; px_type: PXType };
const inputStyle = { width: '240px' };
export default function NewProfiles() {
  const { modal } = App.useApp();
  const { id } = useParams({ from: `/layout/new_profiles/$id` });
  const isEdit = id !== '-1';
  const { history } = useRouter();
  const [form] = Form.useForm<IForm>();
  const [proxyType, setProxyType] = useState<ProxyType>('custom');
  const [pxType, setPxType] = useState<PXType>(1);

  const { data } = useQuery({
    queryKey: ['get-env-by-id', id],
    queryFn: () => getEnvByIdService({ id: toNumber(id) }),
    enabled: isEdit,
  });
  const proxyMutation = useMutation({
    mutationFn: getProxyListService,
    mutationKey: ['posts-env-list'],
    onSuccess: (list) => {
      if (isEdit) {
        const findItemOfData = list.find((item) => item.id === data!.vpc_id);
        console.log(list);
        console.log(data);
        console.log(findItemOfData);
        if (findItemOfData) {
          const { id, address, port, username } = findItemOfData;
          form.setFieldValue('vpc_id', {
            value: id,
            label: `socks://${address}:${port} ${username ? `(${username})` : ''}`,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (isEdit && isObject(data)) {
      form.setFieldsValue({ ...data, formProxyType: 'list' });

      form.setFieldValue('vpc_id', {
        value: data.vpc_id,
        label: `socks://${data.address}:${data.port} ${data.username ? `(${data.username})` : ''}`,
      });
      proxyMutation.mutate();
      setPxType(data?.px_type ?? 1);
    }
  }, [data, isEdit]);

  // 新增Form提交请求
  const addMutation = useMutation({
    mutationFn: postAddEnvService,
    mutationKey: ['add-env'],
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
          form.resetFields();
        },
      });
    },
  });

  // 编辑Form提交请求
  const editMutation = useMutation({
    mutationFn: postAddEnvService,
    mutationKey: ['add-edit-env', id],
    onSuccess: () => {
      modal.confirm({
        title: '编辑环境成功',
        content: '编辑环境成功, 是否继续编辑环境？',
        okText: '继续编辑',
        cancelText: '返回',
        onOk: () => {
          form.resetFields();
        },
        onCancel: () => {
          history.go(-1);
          form.resetFields();
        },
      });
    },
  });

  const handleProxyTypeChange = (values: IForm) => {
    const { formProxyType, px_type, width, height, dpi } = values;
    if (!isUndef(width) || !isUndef(height) || !isUndef(dpi)) {
      setPxType(100);
    } else if ([1, 2, 100].includes(px_type)) {
      setPxType(px_type);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { formProxyType, px_type, ...rest } = values;
    if (px_type === 1) {
      rest.width = 720;
      rest.height = 1080;
      rest.dpi = 320;
    } else if (px_type === 2) {
      rest.width = 1080;
      rest.height = 1920;
      rest.dpi = 480;
    }

    return rest;
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const filteredValues = filterFormValues(values);
    addMutation.mutate(filteredValues as any);
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
            px_type: 1,
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
                    <Form.Item label="分辨率" className="new_profiles_compact h-[32px] mb-0" required>
                      <Resolution pxType={pxType} />
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
                    {!isEdit && proxyType === 'custom' ? <AddProxyFormItems /> : <GetProxyView proxyMutation={proxyMutation} />}
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
        <Button type="primary" onClick={handleSubmit} loading={addMutation.isPending || editMutation.isPending}>
          确定
        </Button>
      </Space>
    </div>
  );
}
