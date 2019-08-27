import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUserAuth } from '../../store/login/actions';
import Layout from '../components/layout';
import './style.scss';
import Util from '../../js/Util';
import Bar from './d3';
import { createHashHistory } from 'history';
const history = createHashHistory({ forceRefresh: true });

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      personsList: [],
      isAuthAdmin: false,
    };
  }
  componentWillMount() {
    this.getUserInfo();
    this.props.getUserAuth();
  }

  componentDidMount() {
    this.initData();
  }

  getUserInfo() {
    const token = Util.getToken();
    if (token) {
      axios
        .get('http://localhost:8080/api/users/info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          if (!data.data.success) {
            history.push('/signin');
          }
          if (data.data.success && data.data.data.auth === 1) {
            this.setState({
              isAuthAdmin: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push('/signin');
    }
  }

  async initData() {
    const eventsListData = await this.getEventsList();
    const personsListData = await this.getPersonsList();
    const eventsList = eventsListData.data.data;
    const personsList = personsListData.data.data;
    const tableData = Util.translateDataToTree(eventsList, personsList);
    this.setState({
      tableData,
      personsList,
    });
  }
  getEventsList() {
    return axios.get('http://localhost:8080/api/events/list');
  }

  getPersonsList() {
    return axios.get('http://localhost:8080/api/persons/list');
  }
  reload() {
    this.initData();
  }

  render() {
    const { tableData, personsList, isAuthAdmin } = this.state;
    console.log(this.props.userAuthData);
    // console.log(tableData);
    return (
      <div>
        <Layout>
          {tableData.length && (
            <Bar
              tableData={tableData}
              personsList={personsList}
              reload={() => this.reload()}
              isAuthAdmin={isAuthAdmin}
            />
          )}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userAuthData: state.userAuthData.data,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
