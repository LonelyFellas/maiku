import { useEffect, useState } from 'react';
import { App, Button, Divider, Form, Input, InputNumber, Radio, Space } from 'antd';
import { Scrollbar } from '@darwish/scrollbar-react';
import { isBlanks, isObject, isUndef } from '@darwish/utils-is';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ContainerWithEmpty, DetailCollapse, onlyTrueObj, PROXY_TYPE, toNumber, useI18nConfig } from '@common';
import { AddProxyFormItems } from '@/pages/discover/proxy/modules/add-proxy-common-formitem.tsx';
import { getEnvByIdService, postAddEnvService, getProxyListService, type GetAllEnvListResult, type PostAddEnvParams, postUpdateEnvService } from '@api';
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
type IForm = PostAddEnvParams & { formProxyType: ProxyType; px_type: PXType; px_type_super: string };
const inputStyle = { width: '240px' };
export default function NewProfiles() {
  const [lang] = useI18nConfig('config.new_profiles');
  const { modal } = App.useApp();
  const { id } = useParams({ from: `/layout/new_profiles/$id` });
  const isEdit = id !== '-1';
  const { history } = useRouter();
  const [form] = Form.useForm<IForm>();
  const [proxyType, setProxyType] = useState<ProxyType>('custom');
  const [pxType, setPxType] = useState<PXType>('1');

  const { data, isFetching } = useQuery({
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
        if (findItemOfData) {
          const { id, address, port, username, type } = findItemOfData;
          form.setFieldValue('vpc_id', {
            value: id,
            label: `${PROXY_TYPE[type]}://${address}:${port} ${username ? `(${username})` : ''}`,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (isEdit && isObject(data)) {
      const toStrPxType = (data.px_type ?? 1).toString() as PXType;
      form.setFieldsValue({ ...data, formProxyType: 'list', px_type: toStrPxType });
      setPxType(toStrPxType);
      console.log('data', form.getFieldsValue());
      proxyMutation.mutate();
    }
  }, [data, isEdit]);

  // 新增Form提交请求
  const addMutation = useMutation({
    mutationFn: postAddEnvService,
    mutationKey: ['add-env'],
    onSuccess: () => {
      modal.confirm({
        title: lang.add_confirm_title,
        content: lang.add_confirm_content,
        okText: lang.add_confirm_okText,
        cancelText: lang.add_confirm_cancelText,
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
    mutationFn: postUpdateEnvService,
    mutationKey: ['add-edit-env', id],
    onSuccess: () => {
      modal.confirm({
        title: lang.edit_confirm_title,
        content: lang.edit_confirm_content,
        okText: lang.edit_confirm_okText,
        cancelText: lang.edit_confirm_cancelText,
        onCancel: () => {
          history.go(-1);
          form.resetFields();
        },
      });
    },
  });

  const handleProxyTypeChange = (changesValues: Partial<IForm>, values: IForm) => {
    const { px_type } = values;
    const { formProxyType, width, height, dpi } = changesValues;
    if (!isUndef(width) || !isUndef(height) || !isUndef(dpi)) {
      setPxType('100');
    } else if (['1', '2', '100'].includes(px_type)) {
      setPxType(px_type);
    }
    if (!isUndef(formProxyType)) {
      setProxyType(formProxyType);
    }
  };

  const handleCancel = () => {
    modal.confirm({
      title: lang.cancel_confirm_title,
      icon: <ExclamationCircleOutlined />,
      content: lang.cancel_confirm_content,
      okText: lang.cancel_confirm_okText,
      cancelText: lang.cancel_confirm_cancelText,
      onOk: () => {
        history.go(-1);
      },
    });
  };

  /** 过滤一些不需要的字段 **/
  const filterFormValues = (values: IForm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { formProxyType, px_type_super, ...rest } = values;
    if (rest.px_type === '1') {
      rest.width = 720;
      rest.height = 1080;
      rest.dpi = 320;
    } else if (rest.px_type === '2') {
      rest.width = 1080;
      rest.height = 1920;
      rest.dpi = 480;
    }

    return rest;
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const filteredValues = filterFormValues(values);
    isEdit ? editMutation.mutate({ ...filteredValues, id: toNumber(id) }) : addMutation.mutate(filteredValues);
  };

  return (
    <ContainerWithEmpty className="h-full" hasData={isEdit ? !isBlanks(data) : true} isFetching={isEdit ? isFetching : false}>
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
            <h1 className="font-bold border-b-[1px] pl-3 py-1 rounded-sm mb-6 pb-3">{lang.form_title1}</h1>
            <Form.Item label={lang.form_title1_item1Env} name="name" className="mb-4" required rules={[{ required: true, message: lang.form_title1_item1Env_placeholder }]}>
              <Input placeholder={lang.form_title1_item1Env_placeholder} style={inputStyle} />
            </Form.Item>
            {/*<h1 className={titleStyle}>云手机信息:</h1>*/}

            <DetailCollapse
              defaultActiveKey={['1']}
              items={[
                {
                  label: lang.form_title2,
                  key: '1',
                  children: (
                    <>
                      <Form.Item label={lang.form_title2_item1Disk} name="disk" className="mt-4">
                        <InputNumber placeholder={lang.form_title2_item1Disk_placeholder} style={inputStyle} />
                      </Form.Item>
                      <Form.Item label={lang.form_title2_item2Memory} name="memory">
                        <InputNumber placeholder={lang.form_title2_item2Memory_placeholder} style={inputStyle} />
                      </Form.Item>
                      <Form.Item label={lang.form_title2_item3DPI} className="new_profiles_compact h-[32px] mb-0" required>
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
                  label: lang.form_title3,
                  key: '1',
                  children: (
                    <>
                      {!isEdit ? (
                        <Form.Item label={lang.form_title3_item1Type} className="mt-4" name="formProxyType">
                          <Radio.Group value={proxyType}>
                            <Radio.Button value="custom">{lang.form_title3_item1Type_custom}</Radio.Button>
                            <Radio.Button value="list">{lang.form_title3_item1Type_list}</Radio.Button>
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
          <Button onClick={handleCancel}>{lang.form_cancel_btn}</Button>
          <Button type="primary" onClick={handleSubmit} loading={addMutation.isPending || editMutation.isPending}>
            {lang.form_submit_btn}
          </Button>
        </Space>
      </div>
    </ContainerWithEmpty>
  );
}
