import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Layout from '../components/layout';
import './style.scss';
import Util from '../../js/Util';
import RelationChart from './d3';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      personsList: [],
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
    const { tableData, personsList } = this.state;
    const { userData } = this.props;
    const { isAuth } = userData;
    return (
      <div>
        <Layout>
          {tableData.length && (
            <RelationChart
              tableData={tableData}
              personsList={personsList}
              reload={() => this.reload()}
              isAuthAdmin={isAuth}
            />
          )}
        </Layout>
      </div>
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
)(Home);
