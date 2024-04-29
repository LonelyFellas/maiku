import { Popover } from 'antd';
import OptionItem from './option-item';
import { ArrowUpOutlined } from '@ant-design/icons';
import '../style.less';
import { useI18nConfig } from '@common';

const UpdateCenter = () => {
  const [lang] = useI18nConfig('config.layout.header.update');

  return (
    <Popover
      overlayClassName="header_btn"
      placement="bottomRight"
      title={lang.title}
      content={<ContentView emptyTitle={lang.empty_title} />}
      trigger="click"
    >
      <>
        <OptionItem icon={ArrowUpOutlined} />
      </>
    </Popover>
  );
};
export default UpdateCenter;

function ContentView({ emptyTitle = '' }: { emptyTitle?: string }) {
  return (
    <div className="w-[400px] h-[120px]">
      <h1 className="all_flex h-full text-xl text-title">{emptyTitle}</h1>
    </div>
  );
}
