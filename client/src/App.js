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
    this.callApi()
      .then(({ data }) => this.setState({ data, loading: false }))
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/players');
    const json = await response.json();

    if (response.status !== 200) throw Error(json.message);

    return json;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { history } = this.props;
    const url = setParams({ query: this.state.searchQuery });
    this.state.searchQuery !== '' ? history.push(`?${url}`) : history.push('/');
  };

  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  getCSV = () => {
    // sorted data state
    const data = this.reactTable.getResolvedState().sortedData;
    this.setState({ data });
  };

  render() {
    const { data, loading, searchQuery } = this.state;
    const { query } = this.props;
    const renderedData = !loading ? data : [];

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
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Search By Player: {query}</strong>
          </p>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => this.handleChange(e)}
          />
          <button type="submit">Search</button>
        </form>
        {data ? CSV : <p>There is an error.</p>}
        <ReactTable
          columns={columns}
          data={renderedData}
          loading={loading}
          ref={(r) => (this.reactTable = r)}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default App;
