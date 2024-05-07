import { Outlet } from '@tanstack/react-router';
import { Scrollbar } from '@darwish/scrollbar-react';

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
