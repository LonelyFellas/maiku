import { useState } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import { Table } from '@common';
import { addTableColumns } from './config';

/**
 * 批量添加代理
 */
export default function AddBatches() {
  const [proxyList] = useState<Darwish.AnyObj[]>([]);
  const lenList = proxyList.length;
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="h-60 flex gap-4">
          <pre className="bg-bg_primary/35 rounded-md p-2">
            说明：
            <br /> 1. 当前仅支持Socks5 一种代理类型。
            <br /> 2. 每一行一个代理，一次最多添加100个代理。
            <br />
            <br />
            <div className="text-text_primary">
              填写格式 (支持Socks5):
              <br />
              {/*{'192.168.0.1:8000{备注}'}*/}
              {/*<br />*/}
              {/*{'192.168.0.1:8000:代理账号:代理密码{备注}'}*/}
              {/*<br />*/}
              {'socks5://192.168.0.1:8000{备注}'}
              {/*<br />*/}
              {/*{'http://[2001:db8:2de:0:0:0:0:e13]:8000{备注}'}*/}
            </div>
          </pre>
          <div className="w-full flex flex-col">
            <Form
              className="w-full"
              initialValues={{
                channel: 'ip2',
              }}
            >
              <Form.Item className="w-full" name="channel" label="IP查询渠道">
                <Select
                  className="w-full"
                  options={[
                    {
                      label: 'IP2Location',
                      value: 'ip2',
                    },
                    {
                      label: 'ip-api',
                      value: 'ip-api',
                    },
                  ]}
                />
              </Form.Item>
            </Form>
            <Input.TextArea
              className="flex-1"
              style={{ resize: 'none' }}
              placeholder="请在此填写您的代理信息"
            />
          </div>
        </div>
        <p>
          <span>已添加代理：</span>
          <span className="mr-6 text-red-500">{lenList}</span>
          <span className="text-cyan-500">
            自动校验重复项，重复代理将添加失败
          </span>
        </p>
        <div className="flex-1 overflow-hidden">
          <Table
            columns={addTableColumns}
            dataSource={new Array(100).fill({
              type: 'socks5',
              ip: '192.168.0.1',
              port: '8000',
              remark: '备注',
              username: 'darwish',
              password: '289582304',
              queryChannel: 'ip2',
              outIp: '192.168.0.1',
            })}
            pagination={false}
          />
        </div>
      </div>
      <div className="pt-4 border-t-[1px] border-gray-100">
        <Space>
          <Button>取消</Button>
          <Button
            type={lenList > 0 ? 'primary' : 'default'}
            disabled={lenList === 0}
          >
            添加
          </Button>
        </Space>
      </div>
    </div>
  );
}
