import { Form, Select } from 'antd';

interface GetProxyViewProps {
  proxyMutation: any;
}

const GetProxyView = (props: GetProxyViewProps) => {
  const { proxyMutation } = props;
  const handleDropdownVisibleChange = (visible: boolean) => {
    if (visible) {
      proxyMutation.mutate();
    }
  };
  const filterSelectData = proxyMutation.data?.map((item) => ({
    value: item.id,
    label: `socks://${item.address}:${item.port} ${item.username ? `(${item.username})` : ''}`,
  }));
  return (
    <Form.Item label="选择代理" name="vpc_id">
      <Select loading={proxyMutation.isPending} onDropdownVisibleChange={handleDropdownVisibleChange} className="!w-[240px]" placeholder="请选择代理类型" options={filterSelectData} />
    </Form.Item>
  );
};
export default GetProxyView;
