import React from "react";
import { Menu, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Icon from 'components/util-components/Icon';
import { sendLogout } from "../../redux/features/auth";
import { useDispatch } from "react-redux";

const menuItem = [
  // {
  // 	title: "Edit Profile",
  // 	icon: EditOutlined ,
  // 	path: "/"
  //   },
  //   {
  // 	title: "Account Settings",
  // 	icon: SettingOutlined,
  // 	path: "/"
  //   },
  //   {
  // 	title: "Billing",
  // 	icon: ShopOutlined ,
  // 	path: "/"
  // },
  //   {
  // 	title: "Help Center",
  // 	icon: QuestionCircleOutlined,
  // 	path: "/"
  // }
]

export const NavProfile = ({ }) => {
	const dispatch = useDispatch();

  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      {/*<div className="nav-profile-header">*/}
      {/*  <div className="d-flex">*/}
      {/*    <div className="pl-3">*/}
      {/*      <h4 className="mb-0">user.</h4>*/}
      {/*      <span className="text-muted">Frontend Developer</span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="nav-profile-body">
        <Menu>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <a href={el.path}>
                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{el.title}</span>
                </a>
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.length + 1} onClick={ async () => {
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
        <Menu.Item>
          <UserOutlined style={{ color: "#FFF" }}></UserOutlined>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}
