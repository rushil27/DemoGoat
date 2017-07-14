import User from './user.model';
import config from '../../../../config';

import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as async from 'async';

// Handles status codes and error message json
// specificity: validation
function validationError(res, statusCode = null) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
    return null;
  };
}

// Handles status codes and error message json
// specificity: error
function handleError(res, statusCode = null) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
    return null;
  };
}

/**
 * Change a users password endpoint
 */
export function changePassword(req, res, next) {
  let userId = req.user._id;
  let oldPass = String(req.body.oldPassword);
  let newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user endpoint
 */
export function create(req, res, next) {
  let newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  return newUser.save()
    .then(user => {
      let token = jwt.sign(
        { _id: user._id },
        config.sessionSecret,
        { expiresIn: 60 * 60 * 5 }
      );

      req.headers.token = token;
      req.user = user;
      next();

      return null;
    })
    .catch(validationError(res));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  let userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Get my info: all user information
 */
export function me(req, res, next) {
  let userId = req.user._id;
  let token = req.headers.token;

  return User.findOne({
    _id: userId
  }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).json({ message: 'User does not exist' });
      }

      if (token) res.json({ token, user });
      else res.json(user);

      return null;
    })
    .catch(err => next(err));
}

/**
 * forgot password endpoint
 */
export function forgot(req, res, next) {
  return async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          return res.json({ data: null, err: 'Email not found' });
          //return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
          user: 'rushil27shah@gmail.com',
          pass: 'a!kruti9429517290'
        }
      });
      var mailOptions = {
        to: user.email,
        cc: 'rushil@elegantmicroweb.com',
        from: 'rushil27shah@gmail.com',
        subject: 'Privacy | Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        //req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        return res.json({ data: user, err: err });
        //done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    return res.json({ data: null, err: err });
    //res.redirect('/forgot');
  });
}




/**
 * Reset Password endpoint
 */
export function reset(req, res, next) {
  console.log(req.body);
  return User.findOne({ resetPasswordToken: req.body.token }, function (err, user) {
    if (!user) {
      res.send({ data: null, err: err });
      return res.redirect('/reset');
    }

    user.password = req.body.password;
    return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  }).catch(validationError(res));
}
