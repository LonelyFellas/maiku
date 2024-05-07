import { Button, Divider, InputNumber, Select, Tooltip } from 'antd';
import { useState } from 'react';
import { cn } from '@common';
import { Scrollbar } from '@darwish/scrollbar-react';
import { InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import './style.css';

export default function UpgradePkg() {
  const [step, setStep] = useState(0);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="mk_divider flex items-center px-10 h-12">
        <div
          className={cn('text-[15px]', {
            'cursor-pointer': step === 1,
          })}
          onClick={step == 1 ? () => setStep(0) : () => null}
        >
          1.选择套餐
        </div>
        <Divider className="w-8 min-w-[unset] mx-2 bg-gray-300 h-[1px] rounded-md" />
        <div
          className={cn(
            'transition-all',
            step === 1 ? 'text-black text-[15px]' : 'text-gray-400',
          )}
        >
          2.订单信息
        </div>
      </div>
      <Scrollbar
        className="flex-1 pl-24 my-6"
        contentStyle={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div className="select_item">
          <span className="order_rounded_full all_flex">1</span>
          <div>选择适合你的套餐</div>
        </div>
        <div className="select_item ">
          <div className="relative w-80 h-32 bg-bg_primary/40 border-2 border-border_primary rounded-xl pt-5 px-5">
            <CheckCircleFilled className="absolute text-[18px] right-3 top-2 text-text_primary" />
            <span>Base</span>
            <p className="mt-4 flex flex-col text-[12px] text-black/60">
              <span>每天可打开次数=环境数*500</span>
              <span>每天可创建次数=环境数*10</span>
            </p>
          </div>
        </div>
        <div className="select_item">
          <span className="order_rounded_full all_flex">2</span>
          <div className="flex gap-2 items-center">
            <span>环境数</span>
            <Select
              className="w-60"
              size="large"
              defaultValue={5}
              options={[
                { label: '5个(费用:$5.00/月)', value: 5 },
                { label: '10个(费用:$9.00/月)', value: 10 },
                { label: '50个(费用:$19.00/月)', value: 50 },
                { label: '100个(费用:$29.00/月)', value: 100 },
                { label: '150个(费用:$39.00/月)', value: 150 },
                { label: '200个(费用:$49.00/月)', value: 200 },
                { label: '250个(费用:$59.00/月)', value: 250 },
                { label: '300个(费用:$69.00/月)', value: 300 },
              ]}
            />
          </div>
        </div>
        <div className="select_item">
          <span className="order_rounded_full all_flex">3</span>
          <div className="flex items-center gap-2">
            <span>团队成员数</span>
            <InputNumber defaultValue={2} size="large" />
            <span>人</span>
            <Tooltip
              placement="bottom"
              title={
                <span className="text-nowrap">
                  每个套餐都包换一个免费的超级管理员
                </span>
              }
            >
              <InfoCircleOutlined className="text-gray-400" />
            </Tooltip>
            <span className="text-red-500">+$5.00/人</span>
          </div>
        </div>
      </Scrollbar>
      <div className="text-center border-t-[1px] border-gray-100 py-5">
        <p>
          <span className="text-lg">套餐费用</span>
          <span className="text-3xl text-text_secondary">$5.00/月</span>
        </p>
        <Button
          type="primary"
          size="large"
          className="w-32 mt-1"
          onClick={step === 0 ? () => setStep(1) : () => null}
        >
          按月订购
        </Button>
      </div>
    </div>
  );
}
