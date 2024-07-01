import { Scrollbar } from '@darwish/scrollbar-react';
import { Outlet } from '@tanstack/react-router';

const Body = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full pt-3">
        <Scrollbar className="h-full bg-white rounded-md">
          <Outlet />
        </Scrollbar>
      </div>
    </div>
  );
};
export default Body;
