import React from 'react';
import axios from 'axios';
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
  componentDidMount() {
    this.getUserInfo();
  }
  getUserInfo() {
    const token = Util.getToken();
    if (token) {
      axios
        .get('http://localhost:8080/api/users/info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          if (data.data.success) {
            this.setState({
              isLogin: true,
              userName: data.data.data.username,
              isAuth: data.data.data.auth === 1,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({
        isLogin: false,
        isAuth: false,
      });
    }
  }
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
    const { location = {} } = history;
    const { pathname } = location;
    const { isAuth, isLogin, userName } = this.state;

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
            <div
              className={pathname === '/manage' ? 'manage active' : 'manage'}
              onClick={() => this.goManage()}
            >
              管理
            </div>
          )}
          <div className="mine">
            {!isLogin ? (
              <Fragment>
                <div
                  className={pathname === '/signin' ? 'sign active' : 'sign'}
                  onClick={() => this.goSign('signin')}
                >
                  Sign In
                </div>
                <div className="split-line">|</div>
                <div
                  className={pathname === '/signup' ? 'sign active' : 'sign'}
                  onClick={() => this.goSign('signup')}
                >
                  Sign Up
                </div>
              </Fragment>
            ) : (
              <Dropdown overlay={menu}>
                <div className="icon-header">
                  <Icon type="smile" className="icon-mine icon" theme="twoTone" />
                  <span className="user-name">{userName}</span>
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

export default CommonHeader;
