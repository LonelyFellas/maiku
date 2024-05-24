import { useState } from 'react';
import { App, Divider, Upload, type UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { fileSizeFormat, PopconfirmButton, Table, timeFormatHours, useI18nConfig } from '@common';
import { postsFileQueryOptions } from '/src/routes/data';
import { axiosUpload } from '@api/axios-upload';
import { GetFilesListResult, postDeleteFileService } from '/src/api';
import './index.css';

const { Dragger } = Upload;
export default function FileTransferStation() {
  const { message } = App.useApp();
  const [lang] = useI18nConfig('config.file_transfer');
  const [recordFiles, setRecordFiles] = useState<UploadFile<any>[]>([]);
  const { data: postsFileData, isFetching, isRefetching, refetch: refetchPostsFile } = useSuspenseQuery(postsFileQueryOptions);

  const deleteMutation = useMutation({
    mutationKey: ['delete-files'],
    mutationFn: postDeleteFileService,
    onSuccess: () => {
      message.success(lang.delete_msg);
      refetchPostsFile();
    },
  });

  const handleUploadOnChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setRecordFiles(info.fileList);
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} ${lang.upload_success_msg}.`);
      refetchPostsFile();
    } else if (status === 'error') {
      message.error(`${info.file.name} ${lang.upload_fail_msg}.`);
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: `#`,
    maxCount: 9,
    customRequest({ file, onSuccess, onError, onProgress }) {
      axiosUpload({
        data: { files: file },
        onSuccess,
        onError,
        onUploadProgress: (event) => onProgress?.({ percent: event }),
        limitSize: 300,
      });
    },
    onChange: handleUploadOnChange,
  };
  const handleRemoteRemoveFile = (id: number) => {
    deleteMutation.mutate({ id });
  };
  const columns: AntdColumns<GetFilesListResult> = [
    {
      title: lang.tb_col_fileName,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: lang.tb_col_customName,
      dataIndex: 'customName',
      key: 'customName',
    },
    {
      title: lang.tb_col_fileSize,
      dataIndex: 'size',
      key: 'size',
      width: 80,
      render: (text: number) => fileSizeFormat(text),
    },
    {
      title: lang.tb_col_uploadTime,
      dataIndex: 'create_at',
      key: 'create_at',
      render: (text: number) => timeFormatHours(text),
    },
    {
      title: lang.tb_col_operation,
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      render: (_: unknown, record: GetFilesListResult) => <PopconfirmButton onConfirm={() => handleRemoteRemoveFile(record.id)} />,
    },
  ];

  return (
    <div className="flex flex-col h-full p-2 2xl:p-4">
      <Table
        columns={columns}
        rowKey="id"
        dataSource={postsFileData}
        paginationTop={-55}
        pagination={{
          total: postsFileData?.length,
          pageSize: 10,
        }}
        isFetching={isFetching}
        isRefetching={isRefetching}
      />
      <Divider className="my-2 2xl:my-4" />
      <div className="relative h-[150px]">
        <Dragger {...props} className={'file-transfer-files ' + (recordFiles.length > 0 ? `file-transfer-has-file` : 'file-transfer-no-file')}>
          <p className="ant-upload-drag-icon !mb-0">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{lang.upload_h1}</p>
          <p className="ant-upload-hint !text-12sm 2xl:!text-[14px]">{lang.upload_h2}</p>
        </Dragger>
      </div>
    </div>
  );
}
