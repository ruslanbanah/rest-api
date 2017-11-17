import Joi from 'joi';

export default {
  // POST /api/auth/login
  authValid: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
};
