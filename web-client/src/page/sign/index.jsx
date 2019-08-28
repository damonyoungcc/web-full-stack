import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { userLogin } from '../../store/login/actions';
import { Form, Icon, Input, Button } from 'antd';
import Layout from '../components/layout';
import './style.scss';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.getUserLogin(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userData } = this.props;
    const { isLogin } = userData;
    if (isLogin) {
      return <Redirect to="/" />;
    }
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
              登录
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData.data,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserLogin: (params) => dispatch(userLogin(params)),
});

const wrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(wrappedLoginForm);
