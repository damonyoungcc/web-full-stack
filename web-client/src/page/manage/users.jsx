import React from 'react';
import { Table, Icon, Tooltip, Switch, message, Modal } from 'antd';
import Util from '../../js/Util';
import Api from '../../js/Api';
import './style.scss';
const { confirm } = Modal;

class UsersManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userListData: [],
    };
  }

  componentDidMount() {
    this.getUserList();
  }

  getUserList() {
    const token = Util.getToken();
    Api.get('/users/list', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.data.success) {
        this.setState({
          userListData: res.data.data,
        });
      }
    });
  }

  // 删除
  deleteUser = (item) => {
    const _this = this;
    confirm({
      title: '确定删除？',
      content: '此操作将删除该人员信息！',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const token = Util.getToken();
        const postUrl = '/users/delete';
        Api.post(
          postUrl,
          { ...item },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
          .then((res) => {
            console.log(res);
            if (res.data.success) {
              message.success('删除成功');
              _this.getUserList();
            } else {
              message.error('删除失败');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  onChange(checked, item) {
    console.log(checked, item);
    const token = Util.getToken();
    const postUrl = '/users/update';
    const { id, username } = item;
    const auth = checked ? 1 : 0;
    Api.post(
      postUrl,
      {
        id,
        username,
        auth,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((res) => {
        if (res.data.success) {
          message.success('更新成功');
          this.getUserList();
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { userListData } = this.state;
    console.log(userListData);
    return (
      <div>
        <Table
          bordered
          dataSource={userListData}
          rowKey={(row) => row.id}
          columns={[
            {
              title: '编号',
              dataIndex: 'id',
              key: 'id',
              align: 'center',
            },
            {
              title: '用户名',
              dataIndex: 'username',
              key: 'username',
              align: 'center',
            },
            {
              title: '管理权限',
              dataIndex: 'auth',
              key: 'auth',
              align: 'center',
              render: (row, item) => (
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked={item.auth === 1}
                  disabled={item.username === 'admin'}
                  onChange={(checked) => this.onChange(checked, item)}
                />
              ),
            },
            {
              title: '操作',
              key: '操作',
              align: 'center',
              render: (row, item) => (
                <div className="person-table-btn">
                  {item.username !== 'admin' ? (
                    <Tooltip placement="top" title={'删除'}>
                      <Icon
                        type="delete"
                        theme="twoTone"
                        twoToneColor="#eb2f96"
                        className="table-btn-item"
                        onClick={() => this.deleteUser(item)}
                      />
                    </Tooltip>
                  ) : (
                    '--'
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  }
}
export default UsersManage;
