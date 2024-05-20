import { useState } from 'react';
import { App, Button, Divider, Popconfirm, Upload } from 'antd';
import type { UploadProps } from 'antd';
import prettyBytes from 'pretty-bytes';
import dayjs from 'dayjs';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { Table } from '@common';
import './index.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import { postsFileQueryOptions } from '/src/routes/data';

const { Dragger } = Upload;
export default function FileTransferStation() {
  const { message } = App.useApp();
  const [recordFiles, setRecordFiles] = useState<any[]>([]);
  const { data: postsFileData, isFetching, isRefetching } = useSuspenseQuery(postsFileQueryOptions);
  console.log(postsFileData);
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
    action: `${import.meta.env.VITE_API_URL}/file/upload`,
    onChange: handleUploadOnChange,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove: handleRemove,
  };
  const columns = [
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
      render: (text: number) => prettyBytes(text),
    },
    {
      title: '上传时间',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (text: any) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: () => (
        <Popconfirm title="确认删除？" onConfirm={() => {}}>
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
        <Table columns={columns} rowKey="id" dataSource={postsFileData} pagination={false} isFetching={isFetching} isRefetching={isRefetching} />
      </div>
      <Divider className="my-2 2xl:my-4" />
      <div className="relative h-[150px]">
        <Dragger {...props} className={recordFiles.length > 0 ? `file-transfer-has-file` : 'file-transfer-no-file'} multiple maxCount={9}>
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
