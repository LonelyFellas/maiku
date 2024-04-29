import { Outlet } from '@tanstack/react-router';

const Body = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <Outlet />
    </div>
  );
};
export default Body;
