async function queryBuilder(inputs, exits) {
  const queryParams = inputs.query;
  let query = {
    condition: {},
    sort: null,
    pagination: {},
  };
  for (let [key, value] of Object.entries(queryParams)) {
    if (key === "slug") Object.assign(query.condition, value);
    else if (key === "filter") {
      Object.assign(query.condition, value);
    } else if (key === "search") {
      let searchKey = Object.keys(value);
      let searchVal = Object.values(value);
      searchKey.forEach((key, i) => {
        Object.assign(query.condition, { [key]: { contains: searchVal[i] } });
      });
    } else if (key === "sort") query.sort = value;
    else if (key === "pg") query.pagination = value;
  }
  return exits.success(query);
}

module.exports = {
  friendlyName: "Select query builder",
  description: "Function used to build the query based on request body",
  inputs: {
    query: {
      type: "ref",
      description: "request body",
    },
  },
  exits: {},
  fn: queryBuilder,
};
