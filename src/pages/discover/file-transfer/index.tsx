import { useState } from 'react';
import { App, Button, Divider, Popconfirm, Upload, type UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { fileSizeFormat, Table, timeFormatHours } from '@common';
import { postsFileQueryOptions } from '/src/routes/data';
import { axiosUpload } from '@api/axios-upload';
import { GetFilesListResult, postDeleteFileService } from '/src/api';
import './index.css';

const { Dragger } = Upload;
export default function FileTransferStation() {
  const { message } = App.useApp();
  const [recordFiles, setRecordFiles] = useState<UploadFile<any>[]>([]);
  const { data: postsFileData, isFetching, isRefetching, refetch: refetchPostsFile } = useSuspenseQuery(postsFileQueryOptions);

  const deleteMutation = useMutation({
    mutationKey: ['delete-files'],
    mutationFn: postDeleteFileService,
    onSuccess: () => {
      message.success('文件删除成功！');
      refetchPostsFile();
    },
  });

  const handleUploadOnChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setRecordFiles(info.fileList);
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功.`);
      refetchPostsFile();
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: `#`,
    maxCount: 9,
    customRequest({ file, onSuccess, onError, onProgress }) {
      if (recordFiles.length === 9) {
        onError?.(new Error('最多只能上传9个文件！'));
        return;
      }
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
      render: (_: unknown, record: GetFilesListResult) => (
        <Popconfirm title="确认删除？" onConfirm={() => handleRemoteRemoveFile(record.id)}>
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>
      ),
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
        <Dragger {...props} className={recordFiles.length > 0 ? `file-transfer-has-file` : 'file-transfer-no-file'}>
          <p className="ant-upload-drag-icon !mb-2">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击文件或拖拽文件到此区域进行上传</p>
          <p className="ant-upload-hint !text-12sm 2xl:!text-[14px]">严禁上传公司数据、用户数据或其他机密文件！ 单个文件大小不超过100M，每次上传不超过9个文件！</p>
        </Dragger>
      </div>
    </div>
  );
}
