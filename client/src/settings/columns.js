/** Used to extract the "T" representing a touchdown */
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
    accessor: 'Yds'
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
