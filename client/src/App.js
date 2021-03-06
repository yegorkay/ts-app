import React, { Component } from 'react';

import './App.css';

import ReactTable from 'react-table';

import { CSVLink } from 'react-csv';

import { setParams } from './utils';

import { headers, columns } from './settings';

class App extends Component {
  state = {
    csv: [],
    data: [],
    loading: true,
    searchQuery: ''
  };

  componentDidMount() {
    const { query } = this.props;
    this.fetchPlayers(query)
      .then(({ data }) =>
        this.setState({ data, loading: false, searchQuery: query })
      )
      .catch((err) => console.log(err));
  }

  fetchPlayers = async (param = '') => {
    const query = param === '' ? '' : `?query=${param}`;
    const response = await fetch(`/api/players${query}`);
    const json = await response.json();

    if (response.status !== 200) throw Error(json.message);

    return json;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { history } = this.props;
    const { searchQuery } = this.state;

    /** Updating the url with the relevant query */
    const url = setParams({ query: searchQuery });
    searchQuery !== '' ? history.push(`?${url}`) : history.push('/');
    this.setState({ loading: true });

    this.fetchPlayers(searchQuery)
      .then(({ data }) => this.setState({ data, loading: false }))
      .catch((err) => console.log(err));
  };

  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  resetTable = () => {
    this.setState({ searchQuery: '', loading: true });
  };

  getCSV = () => {
    /** table data state becomes csv state */
    const csv = this.reactTable.getResolvedState().sortedData;
    this.setState({ csv });
  };

  render() {
    const { data, loading, searchQuery, csv } = this.state;
    const { query } = this.props;

    const noDataText = loading ? '' : 'No results found. 😞';

    const CSV = (
      <CSVLink
        data={csv}
        headers={headers}
        onClick={this.getCSV}
        filename="nfl-rushing-data.csv"
      >
        Download as CSV
      </CSVLink>
    );

    return (
      <div className="App">
        <div className="wrapper">
          <form onSubmit={this.handleSubmit}>
            <div className="ui action input">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search By Player"
                onChange={(e) => this.handleChange(e)}
              />
              <button type="submit" className="ui button">
                Search
              </button>
              <button
                className="ui button"
                disabled={query === ''}
                onClick={this.resetTable}
              >
                Reset
              </button>
            </div>
          </form>
          {data.length !== 0 ? CSV : <p>No CSV available.</p>}
        </div>
        <ReactTable
          data={data}
          columns={columns}
          loading={loading}
          noDataText={noDataText}
          className="-striped -highlight"
          ref={(r) => (this.reactTable = r)}
        />
      </div>
    );
  }
}

export default App;
