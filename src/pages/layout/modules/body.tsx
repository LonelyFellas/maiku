import { Outlet } from '@tanstack/react-router';
import { MacScrollbar } from 'mac-scrollbar';

const Body = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full pt-3">
        <MacScrollbar className="h-full bg-white rounded-md">
          <Outlet />
        </MacScrollbar>
      </div>
    </div>
  );
};
export default Body;
