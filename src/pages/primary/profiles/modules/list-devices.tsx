import { Checkbox, Pagination } from 'antd';
import { SettingFilled } from '@ant-design/icons';
import { ListProps } from '../type';
import { formaDuration } from '../utils';
import { getToken } from '/src/common';

interface ListDevicesProps extends ListProps {
  sizeVal: number;
}
export function ListDevices(props: ListDevicesProps) {
  const handleOpenDevice = (id: number, name: string) => {
    window.ipcRenderer.send('scrcpy:start', {
      adbAddr: '59.63.189.48:29745',
      id,
      name,
      type: 'start',
      token: getToken ?? '',
    });
  };
  return (
    <div
      className="mt-[20px]"
      style={{
        display: props.layout === 'list' ? 'block' : 'none',
      }}
    >
      <div className="flex gap-[10px]">
        {props.deviceData.map((deviceData) => {
          const openTime = formaDuration(deviceData.expTime * 1000);
          return (
            <div
              onClick={() => handleOpenDevice(deviceData.id, deviceData.name)}
              key={deviceData.id}
              className="w-[154px] h-[320px] bg-bg_primary overflow-hidden rounded-md flex flex-col shadow-inner hover:scale-[1.03] transition-all"
              style={{
                width: 154 * ((props.sizeVal - 1) / 4 + 1),
                height: 320 * ((props.sizeVal - 1) / 4 + 1),
              }}
            >
              <div className="h-[54px] px-[10px] flex overflow-hidden">
                <Checkbox></Checkbox>
                <div className="flex-1 overflow-hidden">
                  <span className="text-text_secondary">{deviceData.name}</span>
                  <p className="text-ellipsis flex-1 overflow-hidden text-nowrap text-text_secondary/50" title={openTime}>
                    {openTime}
                  </p>
                </div>
                <SettingFilled className="text-primary" />
              </div>
              <div className="flex-1">
                <img draggable={false} loading="lazy" src={deviceData.screenshot2} className="size-full cursor-pointer" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-[20px]">
        <Pagination />
      </div>
    </div>
  );
}
