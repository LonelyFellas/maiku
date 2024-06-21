import { Button, type ButtonProps, Dropdown } from 'antd';

interface RunButtonProps extends ButtonProps {
  isRunning: boolean;
  onRestartClick: GenericsFn;
}

const RunButton: React.FC<RunButtonProps> = (props) => {
  const { isRunning, onRestartClick, children, ...restProps } = props;

  const items = [
    {
      key: '1',
      label: '重启',
    },
  ];

  if (isRunning) {
    return (
      <Dropdown.Button
        {...restProps}
        menu={{
          items: items,
          onClick: onRestartClick,
        }}
      >
        {children}
      </Dropdown.Button>
    );
  }
  return <Button {...restProps}>{children}</Button>;
};

export default RunButton;
