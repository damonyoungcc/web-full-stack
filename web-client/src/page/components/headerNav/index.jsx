import React from 'react';
import { connect } from 'react-redux';
import { createHashHistory } from 'history';
import './style.scss';
import { Icon, Dropdown, Menu } from 'antd';
import Util from '../../../js/Util';
const history = createHashHistory();
const { Fragment } = React;

class CommonHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      isAuth: false,
      userName: '',
    };
  }
  componentDidMount() {}
  goSign(type) {
    history.push(`/${type}`);
  }
  goHome() {
    history.push('/');
  }
  goManage() {
    history.push('/manage');
  }
  logout() {
    Util.setToken('');
    window.location.reload('/');
  }
  render() {
    // const { location = {} } = history;
    // const { pathname } = location;
    // const { isAuth, isLogin, userName } = this.state;

    const { userData } = this.props;
    const { username, isAuth, isLogin } = userData;

    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={() => this.logout()}>
          退出账户
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="header-nav">
        <div className="home-logo">
          <div className="logo" />
          <div className="logo-text" onClick={() => this.goHome()}>
            Event Manage App
          </div>
        </div>
        <div className="nav-right">
          {isAuth && (
            <div className="manage" onClick={() => this.goManage()}>
              管理
            </div>
          )}
          <div className="mine">
            {!isLogin ? (
              <Fragment>
                <div className="sign" onClick={() => this.goSign('signin')}>
                  Sign In
                </div>
                <div className="split-line">|</div>
                <div className="sign" onClick={() => this.goSign('signup')}>
                  Sign Up
                </div>
              </Fragment>
            ) : (
              <Dropdown overlay={menu}>
                <div className="icon-header">
                  <Icon type="smile" className="icon-mine icon" theme="twoTone" />
                  <span className="user-name">{username}</span>
                  <Icon type="caret-down" className="down icon" />
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData.data,
  };
};

export default connect(
  mapStateToProps,
  null,
)(CommonHeader);
