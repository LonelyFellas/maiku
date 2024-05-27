import { Form, Select } from 'antd';
import { isBlanks } from '@darwish/utils-is';
import type { UseMutationResult } from '@tanstack/react-query';
import { PROXY_TYPE, useI18nConfig } from '@common';
import type { GetProxyListResult } from '@api';

interface GetProxyViewProps {
  proxyMutation: UseMutationResult<GetProxyListResult[], Error, void, unknown>;
}

const GetProxyView = (props: GetProxyViewProps) => {
  const [lang] = useI18nConfig('config.new_profiles');
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
    <Form.Item label={lang?.form_title3_item2Ty} name="vpc_id">
      <Select loading={proxyMutation.isPending} onDropdownVisibleChange={handleDropdownVisibleChange} className="!w-[240px]" placeholder={lang?.form_title3_item2Ty_placeholder} options={filterSelectData} />
    </Form.Item>
  );
};
export default GetProxyView;
