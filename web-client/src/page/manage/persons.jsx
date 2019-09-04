import React from 'react';
import { connect } from 'react-redux';
import { getPersonsList } from '../../store/persons/action';
import { Table, Icon, Tooltip, Button, Modal, Form, Input, message } from 'antd';
import Util from '../../js/Util';
import Api from '../../js/Api'
import './style.scss';
const { confirm } = Modal;
const { TextArea } = Input;

class PersonsManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: '',
      item: {},
    };
  }

  // 组件挂载请求table列表数据
  componentDidMount() {
    this.props.getPersonsList();
  }

  // 显示弹窗组件
  showModal = (type, item) => {
    this.setState({
      visible: true,
      type,
      item,
    });
  };

  // 点击弹窗确定按钮
  handleOk = () => {
    const { form } = this.props;
    const { validateFields } = form;
    const { type } = this.state;
    validateFields((err, values) => {
      if (!err) {
        const token = Util.getToken();
        const postUrl = `/persons/${
          type === '新增' ? 'create' : 'update'
        }`;
        Api
          .post(postUrl, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.success) {
              this.setState(
                {
                  visible: false,
                },
                () => {
                  message.success(`${type}成功`);
                  this.props.getPersonsList();
                },
              );
            } else {
              this.setState(
                {
                  visible: false,
                },
                () => {
                  message.error(res.data.message);
                },
              );
            }
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              visible: false,
            });
          });
      }
    });
  };

  // 取消
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  // 删除人员
  deletePerson = (item) => {
    const _this = this;
    confirm({
      title: '确定删除？',
      content: '此操作将删除该人员信息！',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const token = Util.getToken();
        const postUrl = '/persons/delete';
        const { id } = item;
        Api
          .post(
            postUrl,
            { id },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((res) => {
            console.log(res);
            if (res.data.success) {
              message.success('删除成功');
              _this.props.getPersonsList();
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

  render() {
    const { visible, type, item } = this.state;
    const { personsListData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Tooltip placement="top" title={'新增人员'}>
          <Button
            type="primary"
            icon="plus-square"
            className="person-add"
            onClick={() => this.showModal('新增')}
          >
            新增
          </Button>
        </Tooltip>
        <Table
          bordered
          dataSource={personsListData}
          rowKey={(row) => row.id}
          columns={[
            {
              title: '编号',
              dataIndex: 'id',
              key: 'id',
              align: 'center',
            },
            {
              title: '名字',
              dataIndex: 'name',
              key: 'name',
              align: 'center',
            },
            {
              title: '简介',
              dataIndex: 'brief',
              width: '60%',
              key: 'brief',
              align: 'center',
            },
            {
              title: '操作',
              key: '操作',
              align: 'center',
              render: (row, item) => (
                <div className="person-table-btn">
                  <Tooltip
                    placement="top"
                    title={'编辑'}
                    onClick={() => this.showModal('编辑', item)}
                  >
                    <Icon type="edit" theme="twoTone" className="edit-btn table-btn-item" />
                  </Tooltip>
                  <Tooltip placement="top" title={'删除'}>
                    <Icon
                      type="delete"
                      theme="twoTone"
                      twoToneColor="#eb2f96"
                      className="table-btn-item"
                      onClick={() => this.deletePerson(item)}
                    />
                  </Tooltip>
                </div>
              ),
            },
          ]}
        />
        <Modal
          title={`${type}人员`}
          visible={visible}
          okText="确定"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <Form.Item label="人员编号">
              {getFieldDecorator('id', {
                initialValue: item ? (item || {}).id : null,
              })(<Input disabled placeholder={type === '新增' ? '新增后系统自动生成' : null} />)}
            </Form.Item>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                initialValue: item ? (item || {}).name : null,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="简介">
              {getFieldDecorator('brief', {
                initialValue: item ? (item || {}).brief : null,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<TextArea rows={4} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    personsListData: state.personsListData.data,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getPersonsList: () => dispatch(getPersonsList()),
});
const WrappedPersonsManage = Form.create({ name: 'PersonsManage' })(PersonsManage);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedPersonsManage);
