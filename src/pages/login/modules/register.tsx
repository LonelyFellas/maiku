import { useState } from 'react';
import { Form, Input, Button, Tooltip, Select, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import {
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import imgPhone from '@img/phone.png?url';
import imgMail from '@img/mail.png?url';
import { useI18nConfig } from '@common';
import { registerService } from '@api/user/login';
import type { RegisterParams } from '@api/type';
import { isNumber } from '@darwish/utils-is';
import { LoginProps } from '@/pages/login';

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <MobileOutlined />
    <Select
      value={'CN +86'}
      disabled
      style={{
        width: 100,
      }}
    >
      {/* <Select.Option value="86">+86</Select.Option> */}
      {/* <Select.Option value="87">+87</Select.Option> */}
    </Select>
  </Form.Item>
);

const mobileRules = [
  { required: true, message: '请输入手机号码!' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确!' },
];
const pswRules = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码长度至少为6位' },
];
const register = (props: LoginProps) => {
  const [lang] = useI18nConfig('config.login.register');
  const [form] = Form.useForm<RegisterParams>();
  const [isPhoneRegister, setIsPhoneRegister] = useState(true);
  const { mutate, isPending } = useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      if (isNumber(data)) {
        message.success('注册成功! 正在前往登录..');
        props.handleChangeModuleType('login');
      }
    },
  });

  const handleFinish = (values: RegisterParams) => {
    mutate(values);
  };

  // 密码匹配规则
  const compareToFirstPassword = (_: unknown, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次输入的密码不一致!'));
  };

  // 确认密码规则
  const confirmRules = [
    { required: true, message: '请确认您的密码!' },
    { validator: compareToFirstPassword },
  ];

  return (
    <div className="relative">
      <div
        className="absolute h-[80px] w-[80px] -top-8 -right-10
          cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        onClick={() => setIsPhoneRegister((prev) => !prev)}
      >
        <img
          src={isPhoneRegister ? imgPhone : imgMail}
          alt="icon phone or mail"
        />
      </div>
      <h1 className="text-2xl text-bold">
        {isPhoneRegister ? lang.phone_title : lang.email_title}
      </h1>
      <Form
        layout="vertical"
        className="mt-6"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          prefix: '86',
        }}
      >
        {isPhoneRegister ? (
          <Form.Item
            label={lang.filed_phone}
            name="mobile"
            required
            rules={mobileRules}
            validateTrigger="onBlur"
          >
            <Input
              type="text"
              placeholder={lang.placeholder_phone}
              addonBefore={prefixSelector}
              suffix={
                <Tooltip title={lang.filed_phone_info}>
                  <InfoCircleOutlined
                    style={{
                      color: 'rgba(0,0,0,.45)',
                    }}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
        ) : (
          <Form.Item
            label={lang.filed_email}
            name="email"
            required
            rules={[{ required: true, message: lang.placeholder_email }]}
          >
            <Input
              type="text"
              placeholder={lang.placeholder_email}
              addonBefore={<MailOutlined />}
              suffix={
                <Tooltip title={lang.filed_email_info}>
                  <InfoCircleOutlined
                    style={{
                      color: 'rgba(0,0,0,.45)',
                    }}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
        )}
        {/*<Form.Item*/}
        {/*  label={lang.filed_verify_code}*/}
        {/*  name="verify_code"*/}
        {/*  required*/}
        {/*  rules={[{ required: true, message: lang.placeholder_verify_code }]}*/}
        {/*>*/}
        {/*  <Input*/}
        {/*    placeholder={lang.placeholder_verify_code}*/}
        {/*    prefix={<MailOutlined className="site-form-item-icon" />}*/}
        {/*    addonAfter={*/}
        {/*      <span*/}
        {/*        role="button"*/}
        {/*        className="select-none active:text-text_primary"*/}
        {/*      >*/}
        {/*        {lang.get_verify_code}*/}
        {/*      </span>*/}
        {/*    }*/}
        {/*  />*/}
        {/*</Form.Item>*/}
        <Form.Item
          label={lang.filed_psw}
          name="password"
          required
          rules={pswRules}
          validateTrigger="onBlur"
        >
          <Input.Password
            placeholder={lang.placeholder_psw}
            prefix={<LockOutlined className="site-form-item-icon" />}
            addonAfter={
              <Tooltip title={lang.filed_psw_info}>
                <InfoCircleOutlined
                  style={{
                    color: 'rgba(0,0,0,.45)',
                  }}
                />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="password2"
          required
          rules={confirmRules}
          validateTrigger="onBlur"
        >
          <Input.Password
            placeholder={lang.placeholder_psw}
            prefix={<LockOutlined className="site-form-item-icon" />}
            addonAfter={
              <Tooltip title={lang.filed_psw_info}>
                <InfoCircleOutlined
                  style={{
                    color: 'rgba(0,0,0,.45)',
                  }}
                />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item label={lang.filed_referral_code} name="referal_code">
          <Input
            placeholder={lang.placeholder_referral_code}
            prefix={<UsergroupAddOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={isPending}
            type="primary"
            className="w-full h-10 text-lg"
            htmlType="submit"
          >
            {lang.btn_title}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default register;
