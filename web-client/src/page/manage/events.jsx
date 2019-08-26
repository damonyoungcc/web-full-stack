import React, { Fragment } from 'react';
import axios from 'axios';
import {
  Table,
  Tag,
  Icon,
  Tooltip,
  Button,
  Divider,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd';
import './style.scss';
import Util from '../../js/Util';
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

class EventsManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      visible: false,
      flag: '',
      type: '',
      item: null,
    };
  }

  componentDidMount() {
    this.initData();
  }

  async initData() {
    const eventsListData = await this.getEventsList();
    const personsListData = await this.getPersonsList();
    const eventsList = eventsListData.data.data;
    const personsList = personsListData.data.data;
    const tableData = Util.translateDataToTree(eventsList, personsList);
    this.setState({
      tableData,
    });
  }
  getEventsList() {
    return axios.get('http://localhost:8080/api/events/list');
  }

  getPersonsList() {
    return axios.get('http://localhost:8080/api/persons/list');
  }
  // 显示弹窗组件
  showModal = (type, item, flag) => {
    this.setState({
      visible: true,
      flag,
      type,
      item,
    });
  };
  // 取消
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  // 点击弹窗确定按钮
  handleOk = () => {
    const { form } = this.props;
    const { validateFields } = form;
    const { type, flag, item } = this.state;
    validateFields((err, values) => {
      if (!err) {
        const createtime = Date.now();
        const token = Util.getToken();
        const postUrl = `http://localhost:8080/api/events/${flag === 'add' ? 'create' : 'update'}`;
        values.createtime = createtime;
        if(flag === 'edit') {
          values.id = item.id;
        }
        axios
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
                  this.initData();
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
            this.setState({
              visible: false,
            });
          });
      }
    });
  };

  // 删除最深层级的事件
  deleteEvent(item) {
    const _this = this;
    confirm({
      title: '确定删除？',
      content: '此操作将删除该事件及相关人员信息！',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const token = Util.getToken();
        const postUrl = 'http://localhost:8080/api/events/delete';
        const { id } = item;
        axios
          .post(
            postUrl,
            { id },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((res) => {
            if (res.data.success) {
              message.success('删除成功');
              _this.initData();
            } else {
              message.error('删除失败，请重试');
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
  }

  render() {
    const { tableData, visible, type, item, flag } = this.state;
    const { personsList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Tooltip placement="top" title={'新增一级事件'}>
          <Button
            type="primary"
            icon="plus-square"
            className="event-add"
            onClick={() => this.showModal('新增一级', null, 'add')}
          >
            新增
          </Button>
        </Tooltip>
        {tableData.length && (
          <Table
            bordered
            dataSource={tableData}
            rowKey={(row) => row.id}
            columns={[
              {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
              },
              {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
              },
              {
                title: '内容',
                dataIndex: 'content',
                key: 'content',
                align: 'center',
              },
              {
                title: '参与人员',
                dataIndex: 'personIds',
                key: 'personIds',
                align: 'center',
                render: (row, item) => (
                  <Fragment>
                    {item.personIds.map((item) => (
                      <Tooltip placement="top" title={item.brief} key={item.personId}>
                        <Tag color="blue">{item.name}</Tag>
                      </Tooltip>
                    ))}
                  </Fragment>
                ),
              },
              {
                title: '创建时间',
                dataIndex: 'createtime',
                key: 'createtime',
                align: 'center',
                render: (row, item) => (
                  <span>{new Date(item.createtime).toLocaleDateString()}</span>
                ),
              },
              {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                align: 'center',
                render: (row, item) => <span>{item.pid.description}</span>,
              },
              {
                title: '操作',
                key: '操作',
                render: (row, item) => (
                  <Fragment>
                    <Tooltip
                      placement="top"
                      title={'新增子事件'}
                      onClick={() => this.showModal('新增子', item, 'add')}
                    >
                      <Icon
                        type="plus-circle"
                        theme="twoTone"
                        className="edit-btn table-btn-item"
                      />
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip
                      placement="top"
                      title={'编辑'}
                      onClick={() => this.showModal('编辑', item, 'edit')}
                    >
                      <Icon type="edit" theme="twoTone" className="edit-btn table-btn-item" />
                    </Tooltip>
                    {(!item.children || item.children.length === 0) && (
                      <Fragment>
                        <Divider type="vertical" />
                        <Tooltip placement="top" title={'删除'}>
                          <Icon
                            type="delete"
                            theme="twoTone"
                            twoToneColor="#eb2f96"
                            className="table-btn-item"
                            onClick={() => this.deleteEvent(item)}
                          />
                        </Tooltip>
                      </Fragment>
                    )}
                  </Fragment>
                ),
              },
            ]}
          />
        )}
        <Modal
          title={`${type}事件`}
          visible={visible}
          okText="确定"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <Form.Item
              label="父事件编号"
              extra={
                flag === 'edit' ? (
                  <span className="pid-tip">注：修改父事件编号会影响其所有子事件，请谨慎操作</span>
                ) : (
                  ''
                )
              }
            >
              {getFieldDecorator('pid', {
                initialValue:
                  flag === 'add'
                    ? item && item.id
                      ? item.id
                      : -1
                    : item && item.pid.id !== -1
                    ? item.pid.id
                    : -1,
              })(<InputNumber disabled={flag === 'add'} />)}
            </Form.Item>
            <Form.Item label="事件标题">
              {getFieldDecorator('title', {
                initialValue: flag === 'edit' ? (item || {}).title : null,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder={''} />)}
            </Form.Item>
            <Form.Item label="参与人员">
              {getFieldDecorator('persons', {
                initialValue:
                  flag === 'edit' ? (item.personIds || []).map((item) => item.personId) : [],
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择该事件相关人员（可多选）"
                  optionLabelProp="label"
                >
                  {personsList.map((item) => (
                    <Option value={item.id} key={item.id} label={item.name}>
                      {`编号:${item.id}/姓名:${item.name}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="事件内容">
              {getFieldDecorator('content', {
                initialValue: flag === 'edit' ? (item || {}).content : null,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<TextArea rows={3} />)}
            </Form.Item>
            <Form.Item label="事件描述">
              {getFieldDecorator('description', {
                initialValue: flag === 'edit' ? ((item || {}).pid || {}).description : null,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<TextArea rows={2} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
const WrappedEventsManage = Form.create({ name: 'EventsManage' })(EventsManage);

export default WrappedEventsManage;
