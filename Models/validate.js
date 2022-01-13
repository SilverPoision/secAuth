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

exports.productSchema = (data) => {
  schema = joi.object({
    name: joi.string().min(6).required(),
    images: joi.array().required(),
    sizes: joi.array().required(),
    discription: joi.string().required(),
    price: joi.number().required(),
    category: joi.string().required(),
    subcategory: joi.string().required(),
    colors_avialable: joi.array().required(),
    color: joi.string().required(),
    color_name: joi.string().required(),
    in_stock: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.addToCart = (data) => {
  const schema = joi.object({
    id: joi.string().required(),
    quantity: joi.number().required(),
    size: joi.string(),
    color: joi.string(),
  });
  return schema.validate(data);
};

exports.address = (data) => {
  const schema = joi.object({
    address: joi.string().required(),
    secaddress: joi.string(),
    landmark: joi.string().required(),
    country: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    pincode: joi.number().required(),
    mobile: joi.number().required(),
  });
  return schema.validate(data);
};

exports.proEditSchema = (data) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
    currentpassword: joi.string().min(6).required(),
    newpassword: joi.string().min(6).required(),
    confirmnewpassword: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.nameEditSchema = (data) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
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
