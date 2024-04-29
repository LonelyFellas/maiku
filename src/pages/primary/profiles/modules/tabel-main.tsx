import {
  Button,
  Dropdown,
  // message,
  Pagination,
  Space,
  Table,
  TableColumnsType,
} from 'antd';
import { createContext, useEffect, useState } from 'react';
import {
  operationItems,
} from '@/pages/primary/profiles/config';
import { HorizontalScrollbar } from '@common';
// import { DataType, TableContext } from '@/pages/primary/profiles copy';
export const TableContext = createContext<{ deviceId: string }>({
  deviceId: '-1',
});
export interface DataType {
  key: 1;
  num: React.Key;
  category: string;
  index: number;
  name: string;
  deviceInfo: string;
  remark: string;
  tags: string;
  lastOpenTime: string;
  createTime: string;
  isVisble?: boolean;
}

const TableMain = () => {
  // const [] = useState(false);
  const [id, ] = useState('-1');
  // const handleTriggerModal = () => {
  //   setOpenModal(true);
  // };
  const handleStartScrcpy = () => {
    window.ipcRenderer.send('startScrcpy');
  };

  useEffect(() => {
    // window.adbApi
    //   .connect('192.168.1.2')
    //   .then((id: string) => {
    //     if (window.env.DEV) {
    //       message.success(`adb: ${id}连接成功`);
    //     }
    //     setId(id);
    //   })
    //   .catch((error: Error) => {
    //     message.error(error.toString());
    //   });
  }, []);
  const [columns, ] = useState(() => {
    const defaultColumns = [
      {
        title: '#',
        width: 200,
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '类别',
        width: 200,
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '序号',
        width: 200,
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '名称',
        width: 200,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '设备信息',
        width: 200,
        dataIndex: 'deviceInfo',
        key: 'deviceInfo',
      },
      {
        title: '备注',
        width: 200,
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '标签',
        width: 200,
        dataIndex: 'tags',
        key: 'tags',
      },
      {
        title: '最近打开',
        width: 200,
        dataIndex: 'lastOpenTime',
        key: 'lastOpenTime',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
        key: 'createTime',
      },
      {
        title: (
          <Dropdown menu={{ items: operationItems }} trigger={['click']}>
            <span className="cursor-pointer">操作</span>
          </Dropdown>
        ),
        dataIndex: 'operation',
        fixed: 'right',
        width: 250,
        key: 'operation',
        render: () => (
          <Space>
            <Button type="primary" onClick={handleStartScrcpy}>
              启动
            </Button>
            <Button type="text" size="small">
              编辑
            </Button>

            <Button type="text" size="small">
              备份
            </Button>
            <Button type="text" size="small">
              删除
            </Button>
          </Space>
        ),
      },
    ];
    return defaultColumns.map((col) => ({ ...col, isVisible: true }));
  });
  return (
    <HorizontalScrollbar className="w-full h-full flex-1 bg-white rounded-md overflow-y-auto">
      <TableContext.Provider value={{ deviceId: id }}>
        <Table
          className="antd_close_overflow_auto"
          columns={
            columns
              .filter((col) => col.isVisible)
              .map((col) => ({
                ...col,
                ellipsis: true,
              })) as TableColumnsType<DataType>
          }
          pagination={false}
          // expandable={{
          //   expandedRowRender: () => <ExpandedRowRender />,
          //   rowExpandable: (record) => record.name !== 'Not Expandable',
          //   defaultExpandAllRows: true,
          // }}
          dataSource={[
            {
              key: 1,
              num: '1',
              category: '云手机环境',
              index: 1,
              name: '云手机1',
              deviceInfo: '设备信息',
              remark: '备注',
              tags: '标签',
              lastOpenTime: '最近打开',
              createTime: '创建时间',
            },
          ]}
          scroll={{ x: columns.length * 150 }}
        />
      </TableContext.Provider>
      <Pagination
        className="absolute bottom-[30px] right-8 "
        total={85}
        showTotal={(total) => `共 ${total} 条数据`}
        defaultPageSize={20}
        defaultCurrent={1}
      />
    </HorizontalScrollbar>
  );
};
export default TableMain;
