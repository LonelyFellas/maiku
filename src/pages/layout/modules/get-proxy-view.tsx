import { Form, Select } from 'antd';
import { isBlanks } from '@darwish/utils-is';
import { PROXY_TYPE } from '@common';
import type { UseMutationResult } from '@tanstack/react-query';
import type { GetProxyListResult } from '@api';

interface GetProxyViewProps {
  proxyMutation: UseMutationResult<GetProxyListResult[], Error, void, unknown>;
}

const GetProxyView = (props: GetProxyViewProps) => {
  const { proxyMutation } = props;
  const handleDropdownVisibleChange = (visible: boolean) => {
    if (visible && isBlanks(proxyMutation.data)) {
      proxyMutation.mutate();
    }
  };
  const filterSelectData = proxyMutation.data?.map((item) => ({
    value: item.id,
    label: `${PROXY_TYPE[item.type]}://${item.address}:${item.port} ${item.username ? `(${item.username})` : ''}`,
  }));
  return (
    <Form.Item label="选择代理" name="vpc_id">
      <Select loading={proxyMutation.isPending} onDropdownVisibleChange={handleDropdownVisibleChange} className="!w-[240px]" placeholder="请选择代理类型" options={filterSelectData} />
    </Form.Item>
  );
};
export default GetProxyView;
