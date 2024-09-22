import { Button, Radio, Slider, Space } from 'antd';
import { useState } from 'react';
import { PauseCircleOutlined, MergeCellsOutlined, PoweroffOutlined, WindowsOutlined, Loading3QuartersOutlined, RocketOutlined, TableOutlined, LogoutOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useQueries, useSuspenseQuery } from '@tanstack/react-query';
import { getListDeviceOptions } from '/src/routes/data';
import { ListDevices } from './modules/list-devices';
import { TableDevices } from './modules/table-devices';

async function adbConnect(deviceId: string) {
  const listDevices = await window.adbApi.listDevices();
  const findDevice = listDevices.find((device) => device.id === deviceId);
  if (findDevice === undefined) {
    console.error('No device found');
    window.adbApi.connect(deviceId);
  } else if (findDevice.type === 'offline') {
    window.adbApi.reconnect(deviceId);
  }

  return null;
}

export default function Profiles() {
  const [position, setPosition] = useState<'start' | 'end'>('end');
  const [layout, setLayout] = useState<'list' | 'table'>('list');
  const [sizeVal, setSizeVal] = useState(1);
  const { data: deviceData } = useSuspenseQuery(getListDeviceOptions);
  useQueries({
    queries: deviceData.map((deviceId) => ({
      queryKey: ['adbConnect', deviceId],
      queryFn: () => adbConnect(`59.63.189.48:${deviceId.p1.toString().slice(0, -2) + (40 + deviceId.number)}`),
    })),
  });

  return (
    <div className="p-[20px]">
      <Space>
        <Radio.Group value={position} onChange={(e) => setPosition(e.target.value)}>
          <Radio.Button value="start">全部({deviceData?.length})</Radio.Button>
          <Radio.Button value="end">未分组(2)</Radio.Button>
        </Radio.Group>
        <div
          className="flex items-center ml-[10px]"
          style={{
            display: layout === 'table' ? 'none' : 'flex',
          }}
        >
          <div className="mr-[10px]">显示尺寸</div>
          <Slider min={1} max={10} step={1} value={sizeVal} onChange={(val) => setSizeVal(val)} className="w-[200px]"></Slider>
        </div>
      </Space>
      <div className="flex justify-between mt-[20px]">
        <Radio.Group>
          <Radio.Button>
            <WindowsOutlined className="mr-[5px]" />
            批量打开
          </Radio.Button>
          <Radio.Button>
            <PoweroffOutlined className="mr-[5px]" /> 批量关机
          </Radio.Button>
          <Radio.Button>
            <PauseCircleOutlined className="mr-[5px]" />
            批量开机
          </Radio.Button>
          <Radio.Button>
            <Loading3QuartersOutlined className="mr-[5px]" />
            批量重启
          </Radio.Button>
          <Radio.Button>
            <RocketOutlined className="mr-[5px]" />
            批量设置代理
          </Radio.Button>
          <Radio.Button>
            <TableOutlined className="mr-[5px]" />
            批量改分组
          </Radio.Button>
          <Radio.Button>
            <LogoutOutlined className="mr-[5px]" />
            批量重置
          </Radio.Button>
          <Radio.Button>
            <CloudUploadOutlined className="mr-[5px]" />
            批量传文件
          </Radio.Button>
        </Radio.Group>
        <Button type="primary" icon={<MergeCellsOutlined />} onClick={() => setLayout((prev) => (prev === 'list' ? 'table' : 'list'))}>
          布局切换
        </Button>
      </div>
      <ListDevices sizeVal={sizeVal} deviceData={deviceData} layout={layout} />
      <TableDevices deviceData={deviceData} layout={layout} />
    </div>
  );
}
