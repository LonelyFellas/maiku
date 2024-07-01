import React, { Children, useMemo } from 'react';
import { Collapse, Tabs, Button } from 'antd';
import type { CollapsePanelProps, CollapseProps } from 'antd';
import { useSetState } from '@darwish/hooks-core';
import { isObject } from '@darwish/utils-is';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { toNumber } from '@common';
import './index.css';

const { Panel } = Collapse;

/**
 * @author darwish
 * 重新包装Collapse
 * @param props 继承Antd的Collapse的属性
 */

const DetailCollapse: ReactFCWithChildren<CollapseProps> = (props) => {
  const keys = useMemo(() => {
    if (props.defaultActiveKey) return props.defaultActiveKey;
    return Children.map(props.children, (nodeProperty) => {
      if (isObject(nodeProperty) && 'key' in nodeProperty) {
        return nodeProperty.key;
      }
      return null;
    });
  }, [props.children, props.defaultActiveKey]);

  return (
    <Collapse className="custom-collapse_detail-collapse" bordered={false} ghost expandIconPosition="end" defaultActiveKey={keys as string[]} {...props}>
      {props.children}
    </Collapse>
  );
};

interface DetailPanelProps extends CollapsePanelProps {
  noHeader?: boolean;
}

/**
 * @author darwish
 * 重新包装Collapse的panel
 * @param props 继承Collapse.panel的属性
 */
const DetailPanel: ReactFCWithChildren<DetailPanelProps> = (props) => {
  const { className } = props;
  return (
    <Panel className={`${props.noHeader ? 'panel_no_header' : ''} ${className || ''}`} {...props}>
      {props.children}
    </Panel>
  );
};

interface TabsPanelProps {
  activeKey?: string;
  items: {
    label: string;
    key: string;
    children: React.ReactNode;
  }[];
}

/**
 * @description 重新包装Tabs 可折叠
 * @author darwish
 * @param props 继承Tabs的属性
 * @param props.items 继承Tabs的属性
 */
const TabsPanel: ReactFCWithChildren<TabsPanelProps> = (props) => {
  const [states, setStates] = useSetState({
    activeKey: props?.activeKey || '1', // 当前激活的tab的key
    isActArr: props.items.map(() => true), // 每个tab是否展开
    actKeys: props.items.map(() => ['1']), // 每个tab展开的key
  });
  const { activeKey, isActArr, actKeys } = states;
  const numberActiveKey = toNumber(activeKey);
  const currentIsAct = isActArr[numberActiveKey - 1];

  const reItems = props.items.map((item, index) => ({
    ...item,
    children: (
      <DetailCollapse activeKey={actKeys[index]}>
        <DetailPanel key="1" header="" noHeader>
          {item.children}
        </DetailPanel>
      </DetailCollapse>
    ),
  }));

  const handleClick = () => {
    setStates({
      isActArr: isActArr.map((it, idx) => {
        if (idx + 1 === numberActiveKey) return !it;
        return it;
      }),
      actKeys: actKeys.map((it, idx) => {
        if (idx + 1 === numberActiveKey) return !currentIsAct ? ['1'] : [];
        return it;
      }),
    });
  };

  const ComponentIcon = currentIsAct ? DownOutlined : RightOutlined;
  return (
    <Tabs
      onChange={(key) => setStates({ activeKey: key })}
      className="custom-tabs_detail-collapse"
      defaultActiveKey={activeKey}
      tabBarExtraContent={<Button onClick={handleClick} type="text" icon={<ComponentIcon style={{ fontSize: '12px', marginLeft: '10px' }} />} />}
      items={reItems}
    />
  );
};

export default Object.assign(DetailCollapse, {
  Panel: DetailPanel,
  Tabs: TabsPanel,
});
