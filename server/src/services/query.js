function getPagination(query) {
  const DEFAULT_PAGE_LIMIT = 0;
  const limit = Math.abs(query.limit) || 0;
  const page = Math.abs(query.page) || 1;

  const skip = limit * (page - 1) || DEFAULT_PAGE_LIMIT;
  return {
    skip,
    limit,
  };
}

module.exports = {
    getPagination
}