import React, { useState } from 'react';
import { Menu } from 'antd';
import { connect } from "react-redux";
import { NavProfile } from './NavProfile';

const NavPanel = () => {
  const [state,setState] = useState({ visible: false, time:'' });

  const showDrawer = () => {
    setState({
      visible: true,
    });
  };

  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item>
        </Menu.Item>
        <Menu.Item onClick={showDrawer}>
          <NavProfile ></NavProfile>
        </Menu.Item>
      </Menu>
    </>
  );
}

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale }
};

export default connect(mapStateToProps)(NavPanel);