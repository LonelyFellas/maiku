import { SpinProps, Table, type TableProps } from 'antd';

interface TableFetchProps extends TableProps {
  isFetching?: boolean;
  isRefetching?: boolean;
  isSuccess?: boolean;
}

export function TableFetch(props: TableFetchProps) {
  const { isFetching = false, isRefetching = false, isSuccess = true, ...rest } = props;

  const loadingProps: SpinProps = {};
  if (isRefetching) {
    loadingProps.tip = '正在重新获取数据';
    loadingProps.spinning = true;
  } else if (isFetching) {
    loadingProps.tip = '正在获取数据';
    loadingProps.spinning = true;
  } else if (isSuccess) {
    loadingProps.spinning = false;
  }
  return <Table loading={loadingProps} {...rest} />;
}
