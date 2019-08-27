import React from 'react';
import { createHashHistory } from 'history';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { getUserAuth } from '../../store/login/actions';
import { Form, Icon, Input, Button, message } from 'antd';
import Layout from '../components/layout';
import './style.scss';
import Util from '../../js/Util';
const history = createHashHistory({ forceRefresh: true });

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    const { path } = match;
    this.state = {
      path,
    };
  }
  componentDidMount() {
    // this.getUserInfo();
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
            history.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const isSignIn = this.state.path === '/signin';
    const postUrl = `http://localhost:8080/api/users/${isSignIn ? 'login' : 'register'}`;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios
          .post(postUrl, values)
          .then((data) => {
            if (data.data.success) {
              if (isSignIn) {
                Util.setToken(data.data.data.token);
                history.push('/');
              } else {
                history.push('/signin');
              }
            } else {
              message.error(data.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userAuthData } = this.props;
    console.log(userAuthData);
    const { path } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 22,
          offset: 2,
        },
      },
    };
    return (
      <Layout>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label="用户名" className="item">
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入您的用户名' }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入您的用户名"
              />,
            )}
          </Form.Item>
          <Form.Item label="密码" className="item">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入您的密码' }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入您的密码"
              />,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout} className="item">
            <Button size="large" type="primary" htmlType="submit" className="login-form-button">
              注册
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userAuthData: state.userAuthData.data,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserAuth: (params) => dispatch(getUserAuth(params)),
});

const wrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(wrappedLoginForm);
