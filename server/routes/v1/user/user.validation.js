import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      email: Joi.string().regex(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).required(),
      password: Joi.string().required(),
    },
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string(),
      email: Joi.string().regex(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/),
      password: Joi.string(),
    },
    params: {
      userId: Joi.string().hex().required(),
    },
  },
};
