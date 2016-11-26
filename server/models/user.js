const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({ _id: user._id, access }, 'abc123');

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
}

UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    // return Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

UserSchema.pre('save', function (next) {
  let user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate the salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext with the hashed one
      user.password = hash;
      next();
    })
  })
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
