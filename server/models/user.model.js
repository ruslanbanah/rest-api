import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import userStatus from '../helpers/userStatus'
import userRoles from '../helpers/userRoles'

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: {unique: true},
    match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/],
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailConfirmHash: {
    type: String,
  },
  status: {
    type: String,
    lowercase: true,
    enum: userStatus,
  },
  role: {
    type: String,
    lowercase: true,
    enum: userRoles,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if(user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  getByEmail(email) {
    return this.findOne({ email })
      .exec()
      .then((user) => {
        if(user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
