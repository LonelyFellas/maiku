import { Form, Input, Button, Flex, Checkbox, Tooltip, message } from 'antd';
import { useLocalStorage } from '@darwish/hooks-core';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  InfoCircleOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useI18nConfig, Constants, useTagTitle } from '@common';
import { loginService } from '@api/user/login';
import type { LoginParams } from '@api/type';
import { isObject } from '@darwish/utils-is';
import { LoginProps } from '@/pages/login';

type FormValues = LoginParams & { remember: boolean };

const Login = (props: LoginProps) => {
  const [lang] = useI18nConfig('config.login.login');
  const [form] = Form.useForm<FormValues>();
  const [, setToken] = useLocalStorage<string>(Constants.LOCAL_TOKEN, '');
  const [userInfo, setUserInfo] = useLocalStorage<FormValues | null>(
    Constants.LOCAL_LOGIN_INFO,
    null
  );
  const setTagTitle = useTagTitle((state) => state.setTagTitle);

  const navigate = useNavigate({ from: '/login' });

  const { mutate, isPending } = useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      if (isObject(data)) {
        setUserInfo(
          form.getFieldValue('remember') ? form.getFieldsValue() : null,
        );
        setToken(data.token);
        window.userInfo = data.userInfo;
        message.success('登录成功');
        setTagTitle({
          title: '环境管理',
          url: '/layout/profiles',
        });
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
      <Form
        layout="vertical"
        className="mt-6"
        onFinish={onFinish}
        form={form}
        initialValues={userInfo || {}}
      >
        <Form.Item
          label={lang?.filed_email_phone}
          name="username"
          required
          rules={[{ required: true, message: lang?.required_email_phone }]}
        >
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
        <Form.Item
          label={lang?.filed_psw}
          name="password"
          required
          rules={[{ required: true, message: lang?.required_psw }]}
        >
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
            <Checkbox defaultChecked={userInfo && userInfo.remember ? true : false}>
              {lang?.option_remember_me}
            </Checkbox>
            <span
              className="text-text_primary cursor-pointer hover:text-text_primary/80"
              onClick={() => props.handleChangeModuleType('verify')}
            >
              {lang?.option_forgot_psw}
            </span>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Button
            loading={isPending}
            type="primary"
            className="w-full h-10 text-lg"
            htmlType="submit"
          >
            {lang?.btn_title}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
