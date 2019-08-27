import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserAuth } from '../../../store/login/actions';

class PrivateRoute extends Component {
  componentDidMount() {
    this.props.getUserAuth();
  }

  render() {
    const { component: Component, userData, ...rest } = this.props;
    const { isLogin, isAuth } = userData;
    return (
      <Route
        {...rest}
        render={(props) => {
          return isLogin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/signin',
                state: { from: props.location },
              }}
            />
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    userData: state.userData.data,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivateRoute);
