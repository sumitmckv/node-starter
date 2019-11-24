import * as Joi from '@hapi/joi';

export default {
  create: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      dob: Joi.date().required(),
      info: Joi.object().optional()
    },
  },
  updateById: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      dob: Joi.date().optional(),
      info: Joi.object().optional()
    },
  },
  getById: {
    params: {
      id: Joi.string().required(),
    },
  },
  deleteById: {
    params: {
      id: Joi.string().required(),
    },
  },
};
