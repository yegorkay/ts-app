/** Set URL params in component */
const setParams = ({ query }) => {
  const searchParams = new URLSearchParams();
  searchParams.set('query', query || '');
  return searchParams.toString();
};

export { setParams };
