import React from "react";
import { Menu, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { sendLogout } from "../../redux/features/auth";
import { useDispatch } from "react-redux";
import { labelOfRoles } from "views/app-views/components/enums";

export const NavProfile = ({ }) => {
	const dispatch = useDispatch();
	const user = JSON.parse(localStorage.getItem('user'))
  const userName = String(user.name).replace(/(^\w)|(\s+\w)/g, letter => letter.toUpperCase());

  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
       <div className="d-flex">
         <div className="pl-3">
           <h4 className="mb-0">{ userName }</h4>
           <span className="text-muted">{ labelOfRoles(user.role) }</span>
         </div>
       </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          <Menu.Item key="logout" onClick={ async () => {
	          const res = await dispatch(sendLogout()).unwrap()
	          if(res.code === '200') {
		          localStorage.clear();
		          window.location.href = "/auth"
	          }
          }}>
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item key="user">
          <UserOutlined style={{ color: "#FFF" }}></UserOutlined>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}
