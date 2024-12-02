async function errHandler(inputs) {
  if (inputs.err && inputs.err.code === "E_UNIQUE")
    return inputs.res.status(409).send({
      status: false,
      msg: `${inputs.err.attrNames[0]} already exists!`,
      data: inputs.err,
    });
  else if (inputs.err && inputs.err.name === "UsageError")
    return inputs.res.badRequest({
      status: false,
      msg: "Invalid request format",
      data: inputs.err,
    });
  else if (inputs.err && inputs.err.name === "JsonWebTokenError")
    return inputs.res.status(401).send({
      status: false,
      msg: "Authentication failed, Invalid Token",
      data: inputs.err,
    });
  else if (inputs.err && inputs.err.name === "TokenExpiredError")
    return inputs.res.status(401).send({
      status: false,
      msg: "Authentication failed, Invalid Token",
      data: inputs.err,
    });
  else if (inputs.err.name === "FileNotFound")
    return inputs.res.status(404).send({
      status: false,
      msg: "Not found",
      data: inputs.err,
    });
  else if (inputs.err && inputs.err.message === "REFRESH_TOKEN_NOT_FOUND")
    return inputs.res.status(401).send({
      status: false,
      msg: "Authentication failed, Refresh Token Not Found",
    });
  else if (inputs.err && inputs.err.message === "NO_AUTH_HEADER_FOUND")
    return inputs.res.status(401).send({
      status: false,
      msg: "Authentication failed, Refresh Token Not Found",
    });
  else
    return inputs.res.serverError({
      status: false,
      msg: "Internal server error",
      data: inputs.err,
    });
}

module.exports = {
  friendlyName: "Error handler",
  description: "A function to handle errors",
  inputs: {
    res: {
      type: "ref",
      description: "response object",
    },
    err: {
      type: "ref",
      description: "err object",
    },
  },
  fn: errHandler,
};
