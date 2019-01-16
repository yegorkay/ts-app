import React, { Component } from 'react';

import './App.css';

import ReactTable from 'react-table';

import { setParams } from './utils';

import { headers, columns } from './settings';

import { CSVLink } from 'react-csv';

class App extends Component {
  state = {
    data: null,
    loading: true,
    searchQuery: ''
  };

  componentDidMount() {
    const { query } = this.props;
    this.fetchPlayers(query)
      .then(({ data }) => this.setState({ data, loading: false, searchQuery: query }))
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

    // Updating the url with the relevant query
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
    this.setState({ searchQuery: '', loading: true })
  }

  getCSV = () => {
    // sorted table data state
    const data = this.reactTable.getResolvedState().sortedData;
    this.setState({ data });
  };


  render() {
    const { data, loading, searchQuery } = this.state;
    const { query } = this.props;

    const renderedData = !loading ? data : [];
    const noDataText = loading ? "" : "No results found. 😞";

    const CSV = (
      <CSVLink
        headers={headers}
        onClick={this.getCSV}
        filename="nfl-rushing-data.csv"
        data={renderedData}
      >
        Download as CSV
      </CSVLink>
    );

    return (
      <div className="App">
        <div className="wrapper">
          <form onSubmit={this.handleSubmit}>
            <p>
              <strong>Search By Player</strong>
            </p>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => this.handleChange(e)}
            />
            <button type="submit">Search</button>
            <button disabled={query === ''} onClick={this.resetTable}>Reset</button>
          </form>
          {renderedData.length !== 0 ? CSV : <p>No CSV available.</p>}
        </div>
        <ReactTable
          columns={columns}
          loading={loading}
          data={renderedData}
          noDataText={noDataText}
          className="-striped -highlight"
          ref={(r) => (this.reactTable = r)}
        />
      </div>
    );
  }
}

export default App;
