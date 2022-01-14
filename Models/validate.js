const joi = require("@hapi/joi");

exports.signupSchema = (data) => {
  schema = joi.object({
    name: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.loginSchema = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.forgotSe = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
  });
  return schema.validate(data);
};

exports.forgot_Valid = (data) => {
  const schema = joi.object({
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.nameEditSchema = (data) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.proEditSchema = (data) => {
  const schema = joi.object({
    currentpassword: joi.string().min(6).required(),
    newpassword: joi.string().min(6).required(),
    confirmnewpassword: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.emailEditSchema = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    currentpassword: joi.string().min(6).required(),
  });
  return schema.validate(data);
};
