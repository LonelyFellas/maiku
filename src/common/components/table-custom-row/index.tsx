import { Checkbox, Modal, type ModalProps } from 'antd';
// import { MacScrollbar } from 'mac-scrollbar';
import { Scrollbar } from '@darwish/scrollbar-react';
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { Fragment, useState } from 'react';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconMove from '@img/move.svg?react';
// import type { CustomColumn } from '/src/pages/primary/profiles';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

type CustomColumn = Darwish.AnyObj;

interface TableCustomRowProps extends Omit<ModalProps, 'onOk'> {
  columns: CustomColumn[];
  onOk: (keys: CustomColumn[]) => void;
}

export default function TableCustomRow(props: TableCustomRowProps) {
  const [items, setItems] = useState(props.columns.filter((col) => col.key !== 'operation' && col.key !== 'setting'));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((col) => col.key === active.id);
        const newIndex = items.findIndex((col) => col.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleCheckboxChange = (checked: boolean, key: string) => {
    setItems(
      (item) =>
        item.map((col) => ({
          ...col,
          isVisible: col.key === key ? checked : col.isVisible,
        })) as CustomColumn[],
    );
  };

  const onOk = () => {
    props.onOk(items as CustomColumn[]);
  };

  return (
    <Modal {...props} onOk={onOk} title="自定义显示列" okText={`确定(${items.filter((col) => col.isVisible).length})`}>
      <div className="w-full h-full px-4 py-4 ">
        <div>
          <span className="text-lg">显示内容</span>
          <span className="text-gray-400 ml-2">支持拖动上下排序</span>
        </div>
        <div className="gap-1 py-4 h-[300px] bg-gray-400/20 rounded-md mt-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} autoScroll={false}>
            <Scrollbar className="px-4 h-full">
              <SortableContext items={items.map((col) => ({ id: col.key }))} strategy={verticalListSortingStrategy}>
                {items.map((col) => (
                  <Fragment key={col.key}>
                    <SortableItem items={col} handleCheckboxChange={handleCheckboxChange} />
                  </Fragment>
                ))}
              </SortableContext>
            </Scrollbar>
          </DndContext>
        </div>
      </div>
    </Modal>
  );
}

function SortableItem(props: { items: CustomColumn; handleCheckboxChange: (checked: boolean, key: string) => void }) {
  const { key, title, isVisible } = props.items;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: key });

  const style = {
    PointerEvent: 'none',
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const checkboxChange = (e: CheckboxChangeEvent) => {
    props.handleCheckboxChange(e.target.checked, key);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="h-8 mb-1 bg-white flex items-center justify-between rounded-md shadow-md pl-6">
        <div>
          <Checkbox className="no_drag" checked={isVisible} onChange={checkboxChange}>
            {title}
          </Checkbox>
        </div>
        <div className="pr-3 cursor-move" {...attributes} {...listeners}>
          <IconMove className="w-4 h-4 fill-gray-600" />
        </div>
      </div>
    </div>
  );
}
