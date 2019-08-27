import React from 'react';
import { Tabs } from 'antd';
import Layout from '../components/layout';
import EventsManage from './events';
import PersonsManage from './persons';
import UsersManage from './users';
import Util from '../../js/Util';
import axios from 'axios';
import { createHashHistory } from 'history';
const history = createHashHistory({ forceRefresh: true });
const { TabPane } = Tabs;

class ManageTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowAuth: false,
      personListData: [],
    };
  }

  componentWillMount() {
    this.getUserInfo();
    this.getPersonList();
  }

  // 切换tab的回调函数
  callback(key) {
    if (key === '1') {
      this.getPersonList();
    }
  }

  // 请求人员列表
  getPersonList() {
    axios.get('http://localhost:8080/api/persons/list').then((res) => {
      if (res.data.success) {
        this.setState({
          personListData: res.data.data,
        });
      }
    });
  }

  getUserInfo() {
    const token = Util.getToken();
    if (token) {
      axios
        .get('http://localhost:8080/api/users/info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          if (!data.data.success || data.data.data.auth !== 1) {
            history.push('/');
          }
          if (data.data.data.username === 'admin') {
            this.setState({
              isShowAuth: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push('/');
    }
  }
  render() {
    const { isShowAuth, personListData } = this.state;
    return (
      <Layout>
        <Tabs defaultActiveKey="1" onChange={(key) => this.callback(key)}>
          <TabPane tab="事件管理" key="1">
            <EventsManage key="event" personsList={personListData} />
          </TabPane>
          <TabPane tab="人员管理" key="2">
            <PersonsManage key="person" />
          </TabPane>
          {isShowAuth && (
            <TabPane tab="权限管理" key="3">
              <UsersManage key="user" />
            </TabPane>
          )}
        </Tabs>
      </Layout>
    );
  }
}
export default ManageTab;
