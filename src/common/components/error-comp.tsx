import { Button, Space } from 'antd';
import Wrapper from './wrapper';
import { useNavigate, useRouter } from '@tanstack/react-router';

export default function ErrorComponent() {
  const {
    history: {
      location: { pathname },
    },
  } = useRouter();
  const navigate = useNavigate();
  return (
    <Wrapper>
      <div className="min-h-[50vh] all_flex_col gap-5">
        <div className="text-3xl text-red-500">数据发生了错误！请联系技术支持(TEL: 12032032302)或者重启应用！</div>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (pathname === '/layout/profiles') {
                window.location.reload();
                return;
              }
              navigate({ to: '/layout/profiles' });
            }}
          >
            刷新到主页
          </Button>
          <Button
            type="primary"
            onClick={() => {
              window.ipcRenderer.send('app:operate', 'close');
            }}
          >
            关闭应用
          </Button>
          {/*<Button type="primary" onClick={() => {*/}
          {/*  window.ipcRenderer.send('app:operate', 'restart');*/}
          {/*}}>重启应用</Button>*/}
        </Space>
      </div>
    </Wrapper>
  );
}
