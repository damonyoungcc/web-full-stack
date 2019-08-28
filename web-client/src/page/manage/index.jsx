import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import Layout from '../components/layout';
import EventsManage from './events';
import PersonsManage from './persons';
import UsersManage from './users';

const { TabPane } = Tabs;

class ManageTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowAuth: false,
      personListData: [],
    };
  }

  componentDidMount() {
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

  render() {
    const { personListData } = this.state;
    const { userData } = this.props;
    const { isAdminAuth } = userData;
    return (
      <Layout>
        <Tabs defaultActiveKey="1" onChange={(key) => this.callback(key)}>
          <TabPane tab="事件管理" key="1">
            <EventsManage key="event" personsList={personListData} />
          </TabPane>
          <TabPane tab="人员管理" key="2">
            <PersonsManage key="person" />
          </TabPane>
          {isAdminAuth && (
            <TabPane tab="权限管理" key="3">
              <UsersManage key="user" />
            </TabPane>
          )}
        </Tabs>
      </Layout>
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
)(ManageTab);
