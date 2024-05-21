import { Alert, Button, Popconfirm, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import prettyBytes from 'pretty-bytes';
import { Modal, Table } from '@common';
import { GetFilesListResult, getFilesListService } from '@api';

interface PushFilesModalProps extends AntdModalProps {}

const PushFilesModal = (props: PushFilesModalProps) => {
  const { data, isFetching, isRefetching } = useQuery({
    queryKey: ['posts-file-list'],
    queryFn: getFilesListService,
    enabled: props.open,
  });
  const handleRemoteRemoveFile = () => {};
  const columns: AntdColumns<GetFilesListResult> = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '自定义名称',
      dataIndex: 'customName',
      key: 'customName',
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
      render: (text: number) => prettyBytes(text ?? 0),
    },
    {
      title: '上传时间',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      render: (_: unknown) => (
        <Space>
          <Button type="primary" size="small">
            推送
          </Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleRemoteRemoveFile()}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Modal {...props} title="请从文件中转站推送到云手机（云手机默认存储路径：/sdcard/Download/）" width={700}>
      <Alert message="请选择如下文件，推送到 M317M6531 云手机，请在 文件管理 -> Downnoad 下查看推送进度。" type="error" className="-mt-4 text-red-700 p-[0.3rem] px-3" />
      <Table
        size="small"
        rowKey="key"
        columns={columns}
        pagination={{
          total: data?.length,
          defaultPageSize: 5,
        }}
        isFetching={isFetching}
        isRefetching={isRefetching}
        dataSource={data}
        className="mt-2 2xl:mt-4 min-h-[200px]"
      />
    </Modal>
  );
};
export default PushFilesModal;
