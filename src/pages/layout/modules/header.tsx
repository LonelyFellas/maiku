import { Space } from 'antd';
import ProfileCenter from './profile-center';
import UpdateCenter from './update-center';
import NotificationCenter from './notification-center';
// import { useTagTitle } from '@common';

const Header = () => {
  // const tagTitle = useTagTitle((state) => state.tagTitle);
  // console.log('tagTitle', tagTitle);
  return (
    <div className="flex justify-between h-30px ">
      {/*<h1 className="text-xl font-bold">{tagTitle.title}</h1>*/}
      <div>
        <Space size="large">
          <UpdateCenter />
          <NotificationCenter />
          <ProfileCenter />
        </Space>
      </div>
    </div>
  );
};
export default Header;
