import { Button, Empty, Popover, Space } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useI18nConfig } from '@common';
import { GetReleaseResult } from '@api';
import OptionItem from './option-item';
import '../style.css';

interface UpdateCenterProps {
  newVersionData: GetReleaseResult[] | never[];
  isNewVersion: boolean;
}
const UpdateCenter = (props: UpdateCenterProps) => {
  const { isNewVersion, newVersionData } = props;
  const [lang] = useI18nConfig('config.layout.header.update');

  return (
    <Popover overlayClassName="header_btn" placement="bottomRight" title={lang.title} content={isNewVersion ? <ContentView data={newVersionData[0]} /> : <NoReleseView emptyTitle={lang.empty_title} />} trigger="click">
      <>
        <OptionItem icon={ArrowUpOutlined} />
      </>
    </Popover>
  );
};
export default UpdateCenter;

const NoReleseView = ({ emptyTitle = '' }: { emptyTitle: string }) => <Empty className="w-[400px] h-[120px] m-2 2xl:m-4" description={emptyTitle} />;

function ContentView({ data }: { data: GetReleaseResult }) {
  return (
    <div className="w-[400px] min-h-[120px]">
      <div className="w-full bg-bg_primary/70 min-h-[120px] rounded-md p-2">
        <div className="text-md flex gap-1 items-center">
          软件更新
          <div className="all_flex bg-gradient-to-r from-white/70 to-amber-500 text-white rounded-sm px-[0.3rem] text-[10px] h-[1.1rem]">NEW</div>
        </div>
        <div className="text-12sm mt-2">
          <div>迈库网络{data?.version} 更新说明:</div>
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
        <div className="flex justify-end mt-4">
          <Space>
            <Button size="small" className="text-12sm">
              跳过
            </Button>
            <Button type="primary" size="small" className="text-12sm">
              下载更新
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
