import { Spin } from 'antd';

interface MaskSpinProps {
  content: React.ReactNode;
  loading: boolean;
}

/**
 * 父元素的样式必须要设置成 position: relative
 * 因为这个mask-spin组件的定位是相对于父元素的
 * @param props
 * @constructor
 */
const MaskSpin = (props: MaskSpinProps) => {
  if (!props.loading) return <></>;
  return (
    <div className=" all_flex_col absolute w-full h-full z-10 bg-white/50 gap-2 text-text_secondary  ">
      <Spin />
      <span>{props.content}</span>
    </div>
  );
};
export default MaskSpin;
