import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
});

export const signupSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be at most 50 characters',
      'any.required': 'Full name is required',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
});

export const addUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Full name is required',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
  role: Joi.string()
    .valid('user', 'admin')
    .required()
    .messages({
      'any.only': 'Role must be either user or admin',
      'any.required': 'Role is required',
    }),
});

export const groupSchema = Joi.object({
  groupName: Joi.string()
    .min(2)
    .max(60)
    .required()
    .messages({
      'string.empty': 'Group name is required',
      'string.min': 'Group name must be at least 2 characters',
      'string.max': 'Group name must be at most 60 characters',
      'any.required': 'Group name is required',
    }),
  description: Joi.string()
    .max(300)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must be at most 300 characters',
    }),
});

export const contentSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(120)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 2 characters',
      'string.max': 'Title must be at most 120 characters',
      'any.required': 'Title is required',
    }),
  body: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.empty': 'Content body is required',
      'string.min': 'Body must be at least 2 characters',
      'any.required': 'Content body is required',
    }),
  type: Joi.string()
    .valid('text', 'link', 'announcement')
    .required()
    .messages({
      'any.only': 'Type must be text, link, or announcement',
      'any.required': 'Type is required',
    }),
  groupId: Joi.string().allow('').optional(),
});

export const validateForm = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, curr) => {
    const key = curr.path[0];
    if (!acc[key]) acc[key] = curr.message;
    return acc;
  }, {});
};
