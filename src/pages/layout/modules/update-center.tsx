import { useState } from 'react';
import { Button, Empty, Popover, Progress, Space } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useI18nConfig } from '@common';
import { GetReleaseResult } from '@api';
import OptionItem from './option-item';
import '../style.css';

interface UpdateCenterProps {
  newVersionData: GetReleaseResult[] | never[];
  isNewVersion: boolean;
  handleSkipVersion: (version: string) => void;
  handleDownloadUpdate: () => void;
  progress: number;
  updateStatus: number;
}

const UpdateCenter = (props: UpdateCenterProps) => {
  const [open, setOpen] = useState(false);
  const { isNewVersion, progress, updateStatus, newVersionData, handleSkipVersion, handleDownloadUpdate } = props;
  const [lang] = useI18nConfig('config.layout.header.update');
  const handleSkip = () => {
    handleSkipVersion(newVersionData[0].version);
    setOpen(false);
  };
  const handOpenChange = (status: boolean) => {
    setOpen(status);
  };

  let btnText = '下载更新';

  if (updateStatus === 1) {
    btnText = '更新中';
  } else if (updateStatus === 2) {
    btnText = '立即重启';
  }
  return (
    <Popover
      open={open}
      overlayClassName="header_btn"
      placement="bottomRight"
      title={lang?.title}
      content={
        isNewVersion ? (
          <div className="w-[400px] min-h-[120px]">
            <div className="w-full bg-bg_primary/70 min-h-[120px] rounded-md p-2">
              <div className="text-md flex gap-1 items-center">
                软件更新
                <div className="all_flex bg-gradient-to-r from-white/70 to-amber-500 text-white rounded-sm px-[0.3rem] text-[10px] h-[1.1rem]">NEW</div>
              </div>
              <div className="text-12sm mt-2">
                <div>迈库网络{newVersionData[0]?.version} 更新说明:</div>
                <div dangerouslySetInnerHTML={{ __html: newVersionData[0]?.description }} />
              </div>
              <div className="flex justify-end mt-4">
                <Space>
                  <Button size="small" className="text-12sm" onClick={handleSkip}>
                    跳过
                  </Button>
                  <Button
                    type="primary"
                    ghost={updateStatus !== 2}
                    size="small"
                    className="text-12sm"
                    style={{
                      cursor: updateStatus === 1 ? 'not-allowed' : 'pointer',
                    }}
                    danger={updateStatus === 1}
                    onClick={() => (updateStatus === 1 ? null : handleDownloadUpdate())}
                  >
                    {btnText}
                  </Button>
                </Space>
              </div>

              {/* 自动更新的滚动跳，只在有更新的进度才显示 */}
              {updateStatus !== 0 && <Progress percent={progress} className="w-[96%]" />}
            </div>
          </div>
        ) : (
          <NoReleaseView emptyTitle={lang?.empty_title} />
        )
      }
      trigger="click"
      onOpenChange={handOpenChange}
    >
      <>
        <OptionItem icon={ArrowUpOutlined} />
      </>
    </Popover>
  );
};
export default UpdateCenter;

const NoReleaseView = ({ emptyTitle = '' }: { emptyTitle: string }) => <Empty className="w-[400px] h-[120px] m-2 2xl:m-4" description={emptyTitle} />;


// interface ContentViewProps {
//   data: GetReleaseResult;
//   handleSkipVersion: (version: string) => void;
//   handleDownloadUpdate: () => void;
//   progress: number;
// }

// function ContentView({ data, handleSkipVersion, handleDownloadUpdate, progress }: ContentViewProps) {
//   let btnText = '下载更新';
//
//   if (progress !== 0 && progress !== 100) {
//     btnText = '更新中';
//   } else {
//     btnText = '更新完成';
//   }
//   return (
//     <div className="w-[400px] min-h-[120px]">
//       <div className="w-full bg-bg_primary/70 min-h-[120px] rounded-md p-2">
//         <div className="text-md flex gap-1 items-center">
//           软件更新
//           <div className="all_flex bg-gradient-to-r from-white/70 to-amber-500 text-white rounded-sm px-[0.3rem] text-[10px] h-[1.1rem]">NEW</div>
//         </div>
//         <div className="text-12sm mt-2">
//           <div>迈库网络{data?.version} 更新说明:</div>
//           <div dangerouslySetInnerHTML={{ __html: data?.description }} />
//         </div>
//         <div className="flex justify-end mt-4">
//           <Space>
//             <Button size="small" className="text-12sm" onClick={() => handleSkipVersion(data.version)}>
//               跳过
//             </Button>
//             <Button type="primary" size="small" className="text-12sm" onClick={handleDownloadUpdate} disabled={btnText === '更新中'} danger={btnText === '更新中'}>
//               {btnText}
//             </Button>
//           </Space>
//         </div>
//
//         <Progress percent={progress} />
//       </div>
//     </div>
//   );
// }
