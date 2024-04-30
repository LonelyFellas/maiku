import {
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { Form, Input, Button, Tooltip, Tabs, Select } from 'antd';
import { useI18nConfig } from '@common';

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <div>
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
    </div>
  </Form.Item>
);
const Verify = () => {
  const [lang] = useI18nConfig('config.login.verify');
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={[MobileOutlined, MailOutlined].map((Icon, i) => {
          const id = String(i + 1);
          return {
            key: id,
            label:
              i === 0 ? (
                <span className="text-xl">{lang.phone_title}</span>
              ) : (
                <span className="text-xl">{lang.email_title}</span>
              ),
            children: <VerifyTabChildren isPhoneVerify={i === 0} />,
            icon: <Icon className="text-xl" />,
          };
        })}
      />
    </div>
  );
};
export default Verify;

const VerifyTabChildren = ({ isPhoneVerify = true }) => {
  const [lang] = useI18nConfig('config.login.verify');
  return (
    <Form
      layout="vertical"
      className="mt-6"
      initialValues={{
        prefix: '86',
      }}
    >
      {isPhoneVerify ? (
        <Form.Item
          label={lang.filed_phone}
          name="phonenumber"
          required
          rules={[{ required: true, message: lang.placeholder_phone }]}
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
          name="mail"
          required
          rules={[{ required: true, message: lang.placeholder_email }]}
        >
          <Input
            type="text"
            placeholder={lang.placeholder_email}
            addonBefore={
              <Form.Item name="prefix" noStyle>
                <MailOutlined />
              </Form.Item>
            }
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
      <Form.Item
        label={lang.filed_verify_code}
        name="password1"
        required
        rules={[{ required: true, message: lang.placeholder_verify_code }]}
      >
        <Input
          placeholder={lang.placeholder_verify_code}
          prefix={<MailOutlined className="site-form-item-icon" />}
          addonAfter={
            <span
              role="button"
              className="select-none active:text-text_primary"
            >
              {lang.get_verify_code}
            </span>
          }
        />
      </Form.Item>
      <Form.Item
        label={lang.filed_psw}
        name="password2"
        required
        rules={[{ required: true, message: lang.placeholder_psw }]}
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
        label={lang.filed_confirm_psw}
        name="password3"
        required
        rules={[
          { required: true, message: lang.placeholder_filed_confirm_psw },
        ]}
      >
        <Input.Password
          placeholder={lang.placeholder_filed_confirm_psw}
          prefix={<LockOutlined className="site-form-item-icon" />}
          addonAfter={
            <Tooltip title={lang.filed_confirm_psw_info}>
              <InfoCircleOutlined
                style={{
                  color: 'rgba(0,0,0,.45)',
                }}
              />
            </Tooltip>
          }
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          className="w-full h-10 text-lg"
          htmlType="submit"
        >
          {lang.btn_title}
        </Button>
      </Form.Item>
    </Form>
  );
};
