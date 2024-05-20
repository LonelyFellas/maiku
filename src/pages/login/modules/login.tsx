import { Form, Input, Button, Flex, Checkbox, Tooltip, App } from 'antd';
import { useLocalStorage } from '@darwish/hooks-core';
import { isObject } from '@darwish/utils-is';
import { InfoCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useI18nConfig, Constants } from '@common';
import { loginService, type LoginParams } from '@api';
import type { LoginProps } from '@/pages/login';

type FormValues = LoginParams & { remember: boolean };

const Login = (props: LoginProps) => {
  const { message } = App.useApp();
  const [lang] = useI18nConfig('config.login.login');
  const [form] = Form.useForm<FormValues>();
  const [, setToken] = useLocalStorage<string>(Constants.LOCAL_TOKEN, '');
  const [userInfo, setUserInfo] = useLocalStorage<FormValues | null>(Constants.LOCAL_LOGIN_INFO, null);

  const navigate = useNavigate({ from: '/login' });

  const { mutate, isPending } = useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      if (isObject(data)) {
        setUserInfo(form.getFieldValue('remember') ? form.getFieldsValue() : null);
        setToken(data.token);
        window.userInfo = data.userInfo;
        message.success(lang?.login_info);
        navigate({ to: '/layout/profiles' });
      }
    },
  });

  const onFinish = (values: FormValues) => {
    mutate({ username: values.username, password: values.password });
  };

  return (
    <div>
      <h1 className="text-2xl text-bold">{lang?.btn_title}</h1>
      <Form layout="vertical" className="mt-6" onFinish={onFinish} form={form} initialValues={userInfo || {}}>
        <Form.Item label={lang?.filed_email_phone} name="username" required rules={[{ required: true, message: lang?.required_email_phone }]}>
          <Input
            type="text"
            placeholder={lang?.placeholder_email_phone}
            prefix={<UserOutlined />}
            suffix={
              <Tooltip title={lang?.filed_email_phone_info}>
                <InfoCircleOutlined
                  style={{
                    color: 'rgba(0,0,0,.45)',
                  }}
                />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item label={lang?.filed_psw} name="password" required rules={[{ required: true, message: lang?.required_psw }]}>
          <Input.Password
            placeholder={lang?.placeholder_psw}
            prefix={<LockOutlined className="site-form-item-icon" />}
            addonAfter={
              <Tooltip title={lang?.filed_psw_info}>
                <InfoCircleOutlined
                  style={{
                    color: 'rgba(0,0,0,.45)',
                  }}
                />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Flex justify="space-between">
            <Checkbox defaultChecked={!!userInfo && userInfo.remember}>{lang?.option_remember_me}</Checkbox>
            <span className="text-text_primary cursor-pointer hover:text-text_primary/80" onClick={() => props.handleChangeModuleType('verify')}>
              {lang?.option_forgot_psw}
            </span>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Button loading={isPending} type="primary" className="w-full h-10 text-lg" htmlType="submit">
            {lang?.btn_title}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
