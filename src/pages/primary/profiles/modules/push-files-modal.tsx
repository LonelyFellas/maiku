import { Alert, App, Button, Space } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fileSizeFormat, Modal, PopconfirmButton, Table, timeFormatHours } from '@common';
import { GetFilesListResult, getFilesListService, postDeleteFileService, postPushFileService } from '@api';

interface PushFilesModalProps extends AntdModalProps {
  adbAddr?: string;
  name?: string;
  envId: number;
}

const PushFilesModal = (props: PushFilesModalProps) => {
  const { message } = App.useApp();
  const {
    data,
    isFetching,
    isRefetching,
    refetch: refetchPostsFile,
  } = useQuery({
    queryKey: ['posts-file-list'],
    queryFn: getFilesListService,
    enabled: props.open,
  });
  const deleteMutation = useMutation({
    mutationKey: ['delete-files'],
    mutationFn: postDeleteFileService,
    onSuccess: () => {
      message.success('文件删除成功！');
      refetchPostsFile();
    },
  });
  const pushMutation = useMutation({
    mutationKey: ['push-files'],
    mutationFn: postPushFileService,
    onSuccess: () => {
      message.success('推送成功');
    },
  });
  const handleRemoteRemoveFile = (id: number) => {
    deleteMutation.mutate({ id });
  };
  const handlePushFile = (fileId: number) => {
    pushMutation.mutate({ envId: props.envId, fileId });
  };
  const columns: AntdColumns<GetFilesListResult> = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
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
      width: 80,
      render: (text: number) => fileSizeFormat(text),
    },
    {
      title: '上传时间',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (text: number) => timeFormatHours(text),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (_: unknown, record: GetFilesListResult) => (
        <Space>
          <Button type="primary" size="small" onClick={() => handlePushFile(record.id)}>
            推送
          </Button>
          <PopconfirmButton onConfirm={() => handleRemoteRemoveFile(record.id)} />
        </Space>
      ),
    },
  ];
  return (
    <Modal {...props} title="请从文件中转站推送到云手机（云手机默认存储路径：/sdcard/Download/）" width={700}>
      <Alert message="请选择如下文件，推送到 M317M6531 云手机，请在 文件管理 -> Downnoad 下查看推送进度。" type="error" className="-mt-4 text-red-700 p-[0.3rem] px-3" />
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        paginationTop={-25}
        pagination={{
          total: data?.length,
          pageSize: 5,
        }}
        isFetching={isFetching}
        isRefetching={isRefetching}
        dataSource={data}
        className="mt-2 2xl:mt-4 min-h-[150px] max-h-[330px] 2xl:max-h-[550px]"
      />
    </Modal>
  );
};
export default PushFilesModal;
