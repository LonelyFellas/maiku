import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Form,
  Tag,
  App,
} from 'antd';
import { Modal } from '@common';
import { getProxyByIdService, postAddProxyService, postUpdateProxyService } from '@api/discover/proxy';
import { AddProxyFormItems } from '@/pages/discover/proxy/modules/add-proxy-common-formitem';
import type { PostAddEditProxyParams } from '@api/discover/type';
import { isUndef } from '@darwish/utils-is';

const Item = Form.Item;

interface AddEditProps extends AntdModalProps {
  handleUpdateList: () => void;
  id?: number; // edit时需要传入id, 否则为undefined判断是新增
}

const AddEdit = (props: AddEditProps) => {
  const { message } = App.useApp();
  const { onOk, onCancel, handleUpdateList, ...restProps } = props;
  const isAdd = isUndef(props.id);
  const [form] = Form.useForm<PostAddEditProxyParams>();
  // 提交表单新增请求
  const addMutation = useMutation({
    mutationFn: postAddProxyService,
    mutationKey: ['add-proxy'],
    onSuccess: () => handleRequestSuccessCallback(),
  });
  // 提交表单编辑请求
  const editMutation = useMutation({
    mutationFn: postUpdateProxyService,
    mutationKey: ['edit-proxy', props.id],
    onSuccess: () => handleRequestSuccessCallback(),
  });

  // 处理请求成功回调
  const handleRequestSuccessCallback = () => {
    message.success(`成功${props.title}!`);
    handleUpdateList();
    onOk?.();
  };


  const queryMutation = useMutation({
    mutationFn: getProxyByIdService,
    mutationKey: ['query-proxy-by-id', props.id],
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
  });
  useEffect(() => {
    if (!isAdd && props.open) {
      queryMutation.mutate({ id: props.id! });
    }
  }, [props.id, props.open]);

  const handleOk = async () => {
    const validRes = await form.validateFields();
    isAdd ? addMutation.mutate(validRes) : editMutation.mutate({ ...validRes, id: props.id! });
    form.resetFields();
  };
  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };
  return (
    <Modal {...restProps} width={700} onOk={handleOk} onCancel={handleCancel}>
      <Form
        form={form}
        className="w-[500px] m-auto"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          type: '1',
        }}
      >
        {!isAdd ? (
          <Item label="代理ID" name="id">
            <Tag color="blue">{form.getFieldValue('id')}</Tag>
          </Item>
        ) : null}
        <AddProxyFormItems />
      </Form>
    </Modal>
  );
};
export default AddEdit;

