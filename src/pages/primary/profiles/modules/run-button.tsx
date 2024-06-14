import { type ButtonProps, Dropdown, Radio } from 'antd';
import type { WindowsSize } from '../type.ts';

interface RunButtonProps extends ButtonProps {
  isRunning: boolean;
  onRestartClick: GenericsFn;
  windowSize: WindowsSize[keyof WindowsSize];
  handleWindowsChange: (size: WindowsSize[keyof WindowsSize]) => void;
}

const RunButton: React.FC<RunButtonProps> = (props) => {
  const { isRunning, onRestartClick, children, handleWindowsChange, windowSize, ...restProps } = props;
  console.log(props.windowSize);
  const runningItems = [
    {
      key: '1',
      label: '重启',
    },
  ];

  const notRunningItems = [
    {
      key: 'mini-size',
      label: (
        <div>
          <span>窗口尺寸: </span>
          <Radio.Group size="small" value={windowSize} onChange={(e) => handleWindowsChange(e.target.value)}>
            <Radio.Button value="small">小号</Radio.Button>
            <Radio.Button value="default">默认</Radio.Button>
            <Radio.Button value="large">大号</Radio.Button>
          </Radio.Group>
        </div>
      ),
    },
  ];

  if (isRunning) {
    return (
      <Dropdown.Button
        {...restProps}
        menu={{
          items: runningItems,
          onClick: onRestartClick,
        }}
      >
        {children}
      </Dropdown.Button>
    );
  }
  return (
    <Dropdown.Button {...restProps} menu={{ items: notRunningItems }}>
      {children}
    </Dropdown.Button>
  );
};

export default RunButton;
