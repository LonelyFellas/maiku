import { useState } from 'react';
import { App, Button, Divider, Popconfirm, Upload, type UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { fileSizeFormat, Table, timeFormatHours } from '@common';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { postsFileQueryOptions } from '/src/routes/data';
import { GetFilesListResult, postDeleteFileService, postUploadFileService } from '/src/api';
import './index.css';

const { Dragger } = Upload;
export default function FileTransferStation() {
  const { message } = App.useApp();
  const [recordFiles, setRecordFiles] = useState<any[]>([]);
  const { data: postsFileData, isFetching, isRefetching, refetch: refetchPostsFile } = useSuspenseQuery(postsFileQueryOptions);
  console.log(postsFileData);
  const updateMutation = useMutation({
    mutationKey: ['update-files'],
    mutationFn: postUploadFileService,
    onSuccess: () => {
      message.success('文件上传成功！');
      refetchPostsFile();
    },
  });
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
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const handleRemove = (file: UploadFile<any>) => {
    console.log('onRemove', file);
  };
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: '#',
    maxCount: 9,
    customRequest(options) {
      const file = options.file as RcFile;
      updateMutation.mutate({ files: file });
    },
    onChange: handleUploadOnChange,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove: handleRemove,
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
      <div className="flex-1">
        <Table
          columns={columns}
          rowKey="id"
          dataSource={postsFileData}
          paginationTop={-35}
          pagination={{
            total: postsFileData?.length,
            defaultPageSize: 5,
          }}
          isFetching={isFetching}
          isRefetching={isRefetching}
        />
      </div>
      <Divider className="my-2 2xl:my-4" />
      <div className="relative h-[150px]">
        <Dragger {...props} className={recordFiles.length > 0 ? `file-transfer-has-file` : 'file-transfer-no-file'}>
          <p className="ant-upload-drag-icon !mb-2">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击文件或拖拽文件到此区域进行上传</p>
          <p className="ant-upload-hint !text-12sm 2xl:!text-[14px]">严禁上传公司数据、用户数据或其他机密文件！ 单个文件大小不超过100M，每次上传不超过9个文件！</p>
        </Dragger>
        {/* <Button className="absolute top-2 left-2 2xl:top-4 2xl:left-4" type="primary">
          开始上传
        </Button> */}
      </div>
    </div>
  );
}
