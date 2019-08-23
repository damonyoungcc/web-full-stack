import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Form, Input, InputNumber, message, Select } from 'antd';
import * as d3 from 'd3';
import './style.scss';
import Util from '../../js/Util';
const { Fragment } = React;
const { TextArea } = Input;
const { Option } = Select;

class EventsD3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverItem: {},
      isShowHover: false,
      isShowClick: false,
      visible: false,
      flag: '',
      type: '',
      item: null,
    };
  }

  componentDidMount() {
    const { tableData, isAuthAdmin } = this.props;
    const formatTableData = { title: 'orignal', children: tableData };
    this.drawChart(formatTableData, isAuthAdmin);
  }

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
        if (flag === 'edit') {
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
                  // reload();
                  // window.location.reload()
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

  drawChart(tableData, isAuthAdmin) {
    const _this = this;
    var width = 1200,
      height = 500,
      root;
    var force = d3.layout
      .force()
      .size([width, height])
      .on('tick', tick);

    var svg = d3
      .select('.eventTree')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var link = svg.selectAll('.link'),
      node = svg.selectAll('.node');

    root = tableData;
    update();

    function update() {
      var nodes = flatten(root);
      var links = d3.layout.tree().links(nodes);

      // Restart the force layout.
      force
        .nodes(nodes)
        .links(links)
        .linkDistance([25])
        .gravity([0.01])
        .start();

      // // Update the links…
      link = link.data(links, function(d) {
        return d.target.id;
      });

      // Exit any old links.
      link.exit().remove();

      // Enter any new links.
      link
        .enter()
        .insert('line', '.node')
        .attr('class', 'link')
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      // Update the nodes…
      node = node
        .data(nodes, function(d) {
          return d.id;
        })
        .style('fill', color);

      // Exit any old nodes.
      node.exit().remove();

      // Enter any new nodes.
      node
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .attr('r', function(d) {
          return 6.5;
        })
        .style('fill', color)
        .on('click', click)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('contextmenu', contextmenu)
        .call(force.drag);
    }

    function tick() {
      link
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      node
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        });
    }

    // Color leaf nodes orange, and packages white or blue.
    function color(d) {
      if (d.title === 'orignal') {
        return '#000';
      } else {
        return d._children ? '#3182bd' : d.children ? '#c6dbef' : '#fd8d3c';
      }
    }

    // Toggle children on click.
    function click(d) {
      if (!d3.event.defaultPrevented) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update();
      }
    }

    function contextmenu(d) {
      document.oncontextmenu = function(e) {
        e.returnValue = false;
      };
      if (!isAuthAdmin) {
        return;
      }
      if (d.title === 'orignal') {
        return;
      }
      _this.setState({
        item: d,
        type: '编辑',
        flag: 'edit',
        visible: true,
      });
    }

    function mouseover(d) {
      if (d.title === 'orignal') {
        return;
      }
      _this.setState({
        hoverItem: d,
        isShowHover: true,
      });
    }

    function mouseout(d) {
      if (d.title === 'orignal') {
        return;
      }
      _this.setState({
        isShowHover: false,
      });
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [];
      // i = 0;

      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        // if (!node.id) node.id = ++i;
        nodes.push(node);
      }

      recurse(root);
      return nodes;
    }
  }

  render() {
    const { hoverItem, isShowHover } = this.state;
    const { visible, type, item, flag } = this.state;
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
      <Fragment>
        <div className="eventTree" />
        {isShowHover && (
          <div
            className="tooltip"
            style={{ left: `${hoverItem.x + 150}px`, top: `${hoverItem.y}px` }}
          >
            <div>标题：{hoverItem.title}</div>
            <div>编号：{hoverItem.id}</div>
            <div>内容：{hoverItem.content}</div>
            <div>
              参与人员：
              {hoverItem.personIds.map((item, index) => (
                <span key={index}>{item.name} </span>
              ))}
            </div>
            <div>创建时间：{new Date(hoverItem.createtime).toLocaleDateString()}</div>
            <div>描述：{hoverItem.pid.description}</div>
          </div>
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
      </Fragment>
    );
  }
}
const WrappedEventsD3 = Form.create({ name: 'EventsD3' })(EventsD3);

export default WrappedEventsD3;
// export default BarChart;
