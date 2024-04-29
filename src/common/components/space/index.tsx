interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  direction?: 'horizontal' | 'vertical';
}

export default function Space(props: SpaceProps) {
  const { size = 10, direction = 'horizontal', ...rest } = props;

  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: `${size}px`,
  };

  return (
    <div style={style} {...rest}>
      {props.children}
    </div>
  );
}
