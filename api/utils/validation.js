const { body, validationResult } = require("express-validator");

exports.IsValidate = function (req) {
  const errors = validationResult(req);
  return errors.isEmpty();
};

exports.getErrors = function (req) {
  const errors = validationResult(req);
  return errors.array();
};
