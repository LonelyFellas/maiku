import { Popover } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useI18nConfig } from '@common';
import OptionItem from './option-item';
import '../style.css';

const NotificationCenter = () => {
  const [lang] = useI18nConfig('config.layout.header.notification');
  return (
    <Popover overlayClassName="header_btn" placement="bottomRight" title={lang?.title} content={<ContentView emptyTitle={lang?.empty_title} />} trigger="click">
      <>
        <OptionItem icon={BellOutlined} />
      </>
    </Popover>
  );
};
export default NotificationCenter;

function ContentView({ emptyTitle = '' }: { emptyTitle?: string }) {
  return (
    <div className="w-[400px] h-[120px]">
      <h1 className="all_flex h-full text-xl text-gray-500">{emptyTitle}</h1>
    </div>
  );
}
