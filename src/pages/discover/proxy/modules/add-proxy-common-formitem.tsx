import { Form, Input, InputNumber, Select, Space } from 'antd';
import { useI18nConfig } from '/src/common';

const { Item } = Form;

/**
 * 添加代理的一些别的地方（添加环境）用到公共的ui组件
 * 所以分离出来
 * @constructor
 */
export function AddProxyFormItems() {
  const [lang] = useI18nConfig('config.new_profiles');
  return (
    <>
      <Item label={lang?.form_title3_item2Ty} name="type" required rules={[{ required: true, message: lang?.form_title3_item2Ty_placeholder }]}>
        <Select
          className="!w-[240px]"
          options={[
            { label: 'Socks5', value: '1' },
            { label: 'Http', value: '2', disabled: true },
            { label: 'Https', value: '3', disabled: true },
          ]}
          placeholder={lang?.form_title3_item2Ty_placeholder}
        />
      </Item>
      {/*<Item label="代理查询渠道" name="queryChannel">*/}
      {/*  <Select*/}
      {/*    options={[*/}
      {/*      { label: 'IP2Location', value: 'IP2Location' },*/}
      {/*      { label: 'ip-api', value: 'ip-api' },*/}
      {/*    ]}*/}
      {/*    placeholder="请选择代理查询渠道"*/}
      {/*  />*/}
      {/*</Item>*/}
      <Item label={lang?.form_title3_item3AddPort} style={{ height: '32px' }} required>
        <Space.Compact className="w-[240px]">
          <Item name="address" required rules={[{ required: true, message: lang?.form_title3_item3Add_placeholder }]}>
            <Input name="port" placeholder={lang?.form_title3_item3Add_placeholder} />
          </Item>
          <Item name="port" required rules={[{ required: true, message: lang?.form_title3_item3Port_placeholder }]}>
            <InputNumber addonBefore=":" placeholder={lang?.form_title3_item3Port_placeholder} />
          </Item>
        </Space.Compact>
      </Item>
      <Item label={lang?.form_title3_item4Account} name="username">
        <Input className="w-[240px]" placeholder={lang?.form_title3_item4Account_placeholder} />
      </Item>
      <Item label={lang?.form_title3_item4Psw} name="password">
        <Input.Password className="w-[240px]" placeholder={lang?.form_title3_item4Psw_placeholder} />
      </Item>
      <Item label={lang?.form_title3_itemRemark} name="detail">
        <Input.TextArea className="!w-[240px]" placeholder={lang?.form_title3_itemRemark_placeholder} style={{ resize: 'none' }} />
      </Item>
    </>
  );
}
