/** Used to extract non-numerical characters */
const extractNumber = (text) => {
  if (typeof text === 'string') {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  } else {
    return text;
  }
};

const columns = [
  {
    Header: 'Player Name',
    accessor: 'Player'
  },
  {
    Header: 'Total Rushing Yards',
    id: 'Yds',
    accessor: (row) => extractNumber(row.Yds),
    Cell: (row) => row.original.Yds,
  },
  {
    Header: 'Longest Rush (T = Touchdown Occurred)',
    id: 'Lng',
    accessor: (row) => extractNumber(row.Lng),
    Cell: (row) => row.original.Lng,
  },
  {
    Header: 'Total Rushing Touchdowns',
    accessor: 'TD'
  }
];

export { columns };
