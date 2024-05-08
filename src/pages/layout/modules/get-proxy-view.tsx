import { useMutation } from '@tanstack/react-query';
import { Form, Select } from 'antd';
import { getProxyListService } from '@api/discover/proxy';

const GetProxyView = () => {
  const mutation = useMutation({
    mutationFn: getProxyListService,
    mutationKey: ['posts-env-list'],
  });

  const handleDropdownVisibleChange = (visible: boolean) => {
    if (visible) {
      mutation.mutate();
    }
  };
  const filterSelectData = mutation.data?.map(item => ({ value: item.id, label: item.username }));
  return (
    <Form.Item label="选择代理" name="proxyList">
      <Select
        loading={mutation.isPending}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        className="!w-[240px]"
        placeholder="请选择代理类型"
        options={filterSelectData}
      />
    </Form.Item>
  );
};
export default GetProxyView;
