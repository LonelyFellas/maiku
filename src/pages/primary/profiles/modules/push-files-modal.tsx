import { memo } from 'react';
import { Alert, App, Button, Space } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fileSizeFormat, Modal, PopconfirmButton, Table, timeFormatHours, useI18nConfig, useScreens } from '@common';
import { GetFilesListResult, getFilesListService, postDeleteFileService, postPushFileService } from '@api';

interface PushFilesModalProps extends AntdModalProps {
  adbAddr?: string;
  name?: string;
  envId: number;
}

const PushFilesModal = memo((props: PushFilesModalProps) => {
  const [l] = useI18nConfig();
  const [lang] = useI18nConfig('config.profiles');
  const size = useScreens();
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
      message.success(lang.delete_msg);
      refetchPostsFile();
    },
  });
  const pushMutation = useMutation({
    mutationKey: ['push-files'],
    mutationFn: postPushFileService,
    onSuccess: (res) => {
      message.success(res);
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
      title: lang.column_file_name,
      dataIndex: 'name',
      key: 'name',
      width: 120,
      ellipsis: true,
      render: (text: string) => text,
    },
    {
      title: lang.column_custom_name,
      dataIndex: 'customName',
      key: 'customName',
    },
    {
      title: lang.column_file_size,
      dataIndex: 'size',
      key: 'size',
      width: 80,
      render: (text: number) => fileSizeFormat(text),
    },
    {
      title: lang.column_file_time,
      dataIndex: 'create_at',
      key: 'create_at',
      render: (text: number) => timeFormatHours(text),
    },
    {
      title: lang.column_operation,
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 130,
      render: (_: unknown, record: GetFilesListResult) => (
        <Space>
          <Button type="primary" size="small" onClick={() => handlePushFile(record.id)}>
            {lang.more_push_btn}
          </Button>
          <PopconfirmButton onConfirm={() => handleRemoteRemoveFile(record.id)} />
        </Space>
      ),
    },
  ];

  const msg = `${lang.modal_file_msg1} ${props.name} ${lang.modal_file_msg2}`;
  // const body =
  const headerHeightStyle = { height: l.lang === 'English' ? 60 : 40 };
  const bodyHeightStyle: React.CSSProperties = {};
  if (size === '2xl') {
    bodyHeightStyle['height'] = l.lang === 'English' ? 500 : 475;
  } else {
    bodyHeightStyle['height'] = l.lang === 'English' ? 415 : 390;
  }
  const scrollYVal = size === '2xl' ? 350 : 250;

  return (
    <Modal {...props} title={lang.modal_file_title} width={700} styles={{ body: bodyHeightStyle, header: headerHeightStyle }}>
      <Alert message={msg} type="error" className="-mt-4 text-red-700 p-[0.3rem] px-3" />
      <Table
        bordered
        size="small"
        rowKey="id"
        columns={columns}
        paginationTop={-25}
        pagination={{
          total: data?.length,
          pageSize: 10,
        }}
        scroll={{ y: scrollYVal }}
        isFetching={isFetching}
        isRefetching={isRefetching}
        dataSource={data}
        className="mt-2 2xl:mt-4 h-[330px] 2xl:h-[550px]"
      />
    </Modal>
  );
});
export default PushFilesModal;
