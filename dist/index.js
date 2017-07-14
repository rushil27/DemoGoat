/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(37);
var default_1 = __webpack_require__(19);
var development_1 = __webpack_require__(20);
var production_1 = __webpack_require__(21);
var test_1 = __webpack_require__(22);
function mergeConfig() {
    // Depending on the environment we will merge
    // the default assets and config to corresponding
    // environment files
    var environmentConfig =  true ? development_1.devEnv :
        process.env.NODE_ENV === 'test' ? test_1.testEnv : production_1.prodEnv;
    // Merge config files
    return _.merge(default_1.defaultConfig, environmentConfig);
}
;
var config = mergeConfig();
exports.default = config;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __webpack_require__(9);
var mongoose = __webpack_require__(3);
var authTypes = ['github', 'twitter', 'facebook', 'google'];
// Create mongoose schema like usual
var UserSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: 'A user needs at least a username'
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        lowercase: true,
        required: function () {
            if (authTypes.indexOf(this.provider) === -1) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: function () {
            if (authTypes.indexOf(this.provider) === -1) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    provider: String,
    salt: String,
    facebook: {},
    google: {},
    github: {},
    resetPasswordToken: String,
    resetPasswordExpires: {
        type: Number
    }
});
/**
 * Virtuals
 */
// Public profile information
UserSchema
    .virtual('profile')
    .get(function () {
    return {
        'username': this.username,
        'firstname': this.firstname,
        'lastname': this.lastname,
        'role': this.role
    };
});
// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function () {
    return {
        '_id': this._id,
        'role': this.role
    };
});
/**
 * Validations
 */
// Validate empty email
UserSchema
    .path('email')
    .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return email.length;
}, 'Email cannot be blank');
// Validate empty password
UserSchema
    .path('password')
    .validate(function (password) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return password.length;
}, 'Password cannot be blank');
// Validate email is not taken
UserSchema
    .path('email')
    .validate(function (value) {
    var _this = this;
    return this.constructor.findOne({ email: value }).exec()
        .then(function (user) {
        if (user) {
            if (_this.id === user.id) {
                return true;
            }
            return false;
        }
        return true;
    })
        .catch(function (err) {
        throw err;
    });
}, 'email must be unique');
// Validate username is not taken
UserSchema
    .path('username')
    .validate(function (value) {
    var _this = this;
    return this.constructor.findOne({ username: value }).exec()
        .then(function (user) {
        if (user) {
            if (_this.id === user.id) {
                return true;
            }
            return false;
        }
        return true;
    })
        .catch(function (err) {
        throw err;
    });
}, 'username must be unique');
var validatePresenceOf = function (value) {
    return value && value.length;
};
/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function (next) {
    var _this = this;
    // Handle new/update passwords
    if (!this.isModified('password')) {
        return next();
    }
    if (!validatePresenceOf(this.password)) {
        if (authTypes.indexOf(this.provider) === -1) {
            return next(new Error('Invalid password'));
        }
        else {
            return next();
        }
    }
    // Make salt with a callback
    this.makeSalt(function (saltErr, salt) {
        if (saltErr) {
            return next(saltErr);
        }
        _this.salt = salt;
        _this.encryptPassword(_this.password, function (encryptErr, hashedPassword) {
            if (encryptErr) {
                return next(encryptErr);
            }
            _this.password = hashedPassword;
            next();
        });
    });
});
/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate: function (password, callback) {
        var _this = this;
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }
        this.encryptPassword(password, function (err, pwdGen) {
            if (err) {
                return callback(err);
            }
            if (_this.password === pwdGen) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });
    },
    /**
     * Make salt
     *
     * @param {Number} byteSize Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt: function (byteSize, callback) {
        var defaultByteSize = 16;
        if (typeof arguments[0] === 'function') {
            callback = arguments[0];
            byteSize = defaultByteSize;
        }
        else if (typeof arguments[1] === 'function') {
            callback = arguments[1];
        }
        if (!byteSize) {
            byteSize = defaultByteSize;
        }
        if (!callback) {
            return crypto.randomBytes(byteSize).toString('base64');
        }
        return crypto.randomBytes(byteSize, function (err, salt) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, salt.toString('base64'));
            }
        });
    },
    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword: function (password, callback) {
        if (!password || !this.salt) {
            if (!callback) {
                return null;
            }
            else {
                return callback('Missing password or salt');
            }
        }
        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');
        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512')
                .toString('base64');
        }
        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', function (err, key) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, key.toString('base64'));
            }
        });
    }
};
// Export default for es6 import
exports.default = mongoose.model('User', UserSchema);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("graceful-fs");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = __webpack_require__(2);
var config_1 = __webpack_require__(0);
var jwt = __webpack_require__(10);
var nodemailer = __webpack_require__(40);
var crypto = __webpack_require__(9);
var async = __webpack_require__(30);
// Handles status codes and error message json
// specificity: validation
function validationError(res, statusCode) {
    if (statusCode === void 0) { statusCode = null; }
    statusCode = statusCode || 422;
    return function (err) {
        res.status(statusCode).json(err);
        return null;
    };
}
// Handles status codes and error message json
// specificity: error
function handleError(res, statusCode) {
    if (statusCode === void 0) { statusCode = null; }
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
        return null;
    };
}
/**
 * Change a users password endpoint
 */
function changePassword(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);
    return user_model_1.default.findById(userId).exec()
        .then(function (user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            return user.save()
                .then(function () {
                res.status(204).end();
            })
                .catch(validationError(res));
        }
        else {
            return res.status(403).end();
        }
    });
}
exports.changePassword = changePassword;
/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res) {
    return user_model_1.default.find({}, '-salt -password').exec()
        .then(function (users) {
        res.status(200).json(users);
    })
        .catch(handleError(res));
}
exports.index = index;
/**
 * Creates a new user endpoint
 */
function create(req, res, next) {
    var newUser = new user_model_1.default(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    return newUser.save()
        .then(function (user) {
        var token = jwt.sign({ _id: user._id }, config_1.default.sessionSecret, { expiresIn: 60 * 60 * 5 });
        req.headers.token = token;
        req.user = user;
        next();
        return null;
    })
        .catch(validationError(res));
}
exports.create = create;
/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy(req, res) {
    return user_model_1.default.findByIdAndRemove(req.params.id).exec()
        .then(function () {
        res.status(204).end();
    })
        .catch(handleError(res));
}
exports.destroy = destroy;
/**
 * Get a single user
 */
function show(req, res, next) {
    var userId = req.params.id;
    return user_model_1.default.findById(userId).exec()
        .then(function (user) {
        if (!user) {
            return res.status(404).end();
        }
        res.json(user.profile);
    })
        .catch(function (err) { return next(err); });
}
exports.show = show;
/**
 * Get my info: all user information
 */
function me(req, res, next) {
    var userId = req.user._id;
    var token = req.headers.token;
    return user_model_1.default.findOne({
        _id: userId
    }, '-salt -password').exec()
        .then(function (user) {
        if (!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }
        if (token)
            res.json({ token: token, user: user });
        else
            res.json(user);
        return null;
    })
        .catch(function (err) { return next(err); });
}
exports.me = me;
/**
 * forgot password endpoint
 */
function forgot(req, res, next) {
    return async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            user_model_1.default.findOne({ email: req.body.email }, function (err, user) {
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
                secure: true,
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
        if (err)
            return next(err);
        return res.json({ data: null, err: err });
        //res.redirect('/forgot');
    });
}
exports.forgot = forgot;
/**
 * Reset Password endpoint
 */
function reset(req, res, next) {
    console.log(req.body);
    return user_model_1.default.findOne({ resetPasswordToken: req.body.token }, function (err, user) {
        if (!user) {
            res.send({ data: null, err: err });
            return res.redirect('/reset');
        }
        user.password = req.body.password;
        return user.save()
            .then(function () {
            res.status(204).end();
        })
            .catch(validationError(res));
    }).catch(validationError(res));
}
exports.reset = reset;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = __webpack_require__(2);
var config_1 = __webpack_require__(0);
var jwt = __webpack_require__(10);
var expressJwt = __webpack_require__(35);
var compose = __webpack_require__(32);
var validateJwt = expressJwt({
    secret: config_1.default.sessionSecret
});
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        .use(function (req, res, next) {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
            req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        return validateJwt(req, res, next);
    })
        .use(function (req, res, next) {
        return user_model_1.default.findById(req.user._id)
            .then(function (user) {
            if (!user) {
                return res.status(401).json({ message: 'Invalid Token' });
            }
            req.user = user;
            next();
            // runnaway promise to remove node warning
            return null;
        })
            .catch(function (err) { return next(err); });
    });
}
exports.isAuthenticated = isAuthenticated;
/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }
    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
        if (config_1.default.userRoles.indexOf(req.user.role) >=
            config_1.default.userRoles.indexOf(roleRequired)) {
            next();
        }
        else {
            res.status(403).send('Forbidden');
        }
    });
}
exports.hasRole = hasRole;
/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id, role) {
    return jwt.sign({
        _id: id,
        role: role
    }, config_1.default.sessionSecret, {
        expiresIn: 60 * 60 * 5
    });
}
exports.signToken = signToken;
/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
    if (!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
}
exports.setTokenCookie = setTokenCookie;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mongo_db_1 = __webpack_require__(27);
var Rx = __webpack_require__(11);
function connect() {
    var obs = [];
    obs.push(mongo_db_1.mongoConnect());
    return obs.length > 1 ? Rx.Observable.merge.apply(this, obs) : obs[0];
}
exports.connect = connect;
function disconnect() {
    mongo_db_1.mongoDisconnect();
}
exports.disconnect = disconnect;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// importing modules the es6 way
var routes_1 = __webpack_require__(28);
var config_1 = __webpack_require__(0);
var mongoose = __webpack_require__(3);
var path = __webpack_require__(42);
var passport = __webpack_require__(4);
var express = __webpack_require__(1);
var fs = __webpack_require__(6);
var morgan = __webpack_require__(39);
var bodyParser = __webpack_require__(31);
var methodOverride = __webpack_require__(38);
var cookieParser = __webpack_require__(34);
var session = __webpack_require__(36);
var connectMongo = __webpack_require__(33);
var MongoStore = connectMongo(session);
// function to initialize the express app
function expressInit(app) {
    //aditional app Initializations
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    // Initialize passport and passport session
    app.use(passport.initialize());
    //initialize morgan express logger
    // NOTE: all node and custom module requests
    if (true) {
        app.use(morgan('dev', {
            skip: function (req, res) { return res.statusCode < 400; }
        }));
    }
    app.use(session({
        secret: config_1.default.sessionSecret,
        saveUninitialized: true,
        resave: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
    //sets the routes for all the API queries
    routes_1.default(app);
    var dist = fs.existsSync('dist');
    //exposes the client and node_modules folders to the client for file serving when client queries "/"
    app.use('/node_modules', express.static('node_modules'));
    app.use('/custom_modules', express.static('custom_modules'));
    app.use(express.static("" + (dist ? 'dist/client' : 'client')));
    app.use('/public', express.static('public'));
    //exposes the client and node_modules folders to the client for file serving when client queries anything, * is a wildcard
    app.use('*', express.static('node_modules'));
    app.use('*', express.static('custom_modules'));
    app.use('*', express.static("" + (dist ? 'dist/client' : 'client')));
    app.use('*', express.static('public'));
    // starts a get function when any directory is queried (* is a wildcard) by the client, 
    // sends back the index.html as a response. Angular then does the proper routing on client side
    if (false)
        app.get('*', function (req, res) {
            res.sendFile(path.join(process.cwd(), "/" + (dist ? 'dist/client' : 'client') + "/index.html"));
        });
    return app;
}
;
exports.default = expressInit;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
var user_model_1 = __webpack_require__(2);
function mongoSeed(env) {
    // Insert seeds below
    switch (env) {
        case "development":
            user_model_1.default.find({}).remove().then(function () {
                user_model_1.default.create({
                    username: 'AdMiN',
                    firstname: 'admin',
                    lastname: 'admin',
                    email: 'admin@admin.com',
                    password: 'admin1',
                    resetPasswordToken: 0,
                    resetPasswordExpires: 0
                }, {
                    username: 'test',
                    firstname: 'testFirst',
                    lastname: 'testLast',
                    email: 'test@test.com',
                    password: 'test',
                    resetPasswordToken: 0,
                    resetPasswordExpires: 0
                });
            }).catch(function (error) { return console.log(error); });
            break;
        case "test":
            user_model_1.default.find({}).remove().then(function () {
                user_model_1.default.create({
                    username: 'test',
                    firstname: 'testFirst',
                    lastname: 'testLast',
                    email: 'test@test.com',
                    password: 'test',
                    resetPasswordToken: 0,
                    resetPasswordExpires: 0
                });
            }).catch(function (error) { return console.log(error); });
            break;
        default:
            // code...
            break;
    }
}
exports.default = mongoSeed;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Socket imports go here
// When the user disconnects.. perform this
function onDisconnect(socket) {
}
// When the user connects.. perform this
function onConnect(socket) {
    // When the client emits 'info', this listens and executes
    socket.on('info', function (data) {
        socket.log(JSON.stringify(data, null, 2));
    });
    // Insert sockets below
}
function socketInit(socketio) {
    // socket.io (v1.x.x) is powered by debug.
    // We can authenticate socket.io users and access their token through socket.decoded_token
    //
    // 1. You will need to send the token in `app/services/socketio/socketio.service.ts`
    //
    // 2. Require authentication here:
    // socketio.use(require('socketio-jwt').authorize({
    //   secret: config.secrets.session,
    //   handshake: true
    // }));
    socketio.on('connection', function (socket) {
        socket.address = socket.request.connection.remoteAddress +
            ':' + socket.request.connection.remotePort;
        socket.connectedAt = new Date();
        socket.log = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            console.log.apply(console, ["SocketIO " + socket.nsp.name + " [" + socket.address + "]"].concat(data));
        };
        // Call onDisconnect.
        socket.on('disconnect', function () {
            onDisconnect(socket);
            socket.log('DISCONNECTED');
        });
        // Call onConnect.
        onConnect(socket);
        socket.log('CONNECTED');
    });
}
exports.default = socketInit;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
==============================================================================================
These configuration settings get called no matter what Node's process.env.NODE_ENV is set to.
==============================================================================================
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    // Change to use https
    https_secure: false,
    // You will need to generate a self signed ssl certificate
    // using the generator in ./scripts or use a trusted certificate
    cert_loc: './server/sslcerts/cert.pem',
    key_loc: './server/sslcerts/key.pem',
    port: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).PORT || 5000,
    host: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).HOST || '0.0.0.0',
    // Session Cookie settings
    sessionCookie: {
        // session expiration is set by default to 24 hours
        maxAge: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: true,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionSecret should be changed for security measures and concerns
    sessionSecret: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).SESSION_SECRET || 'APP',
    // sessionKey is set to the generic sessionId key used by PHP applications
    // for obsecurity reasons
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    userRoles: ['guest', 'user', 'admin']
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
===============================================
Used when process.env.NODE_ENV = 'development'
===============================================
//This file adds config settings and overwrites config settings in the ./default.ts file
//process.env.NODE_ENV is utilized in config/config.ts
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.devEnv = {
    mongo: {
        uri: 'mongodb://localhost/privacy',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).MONGODB_DEBUG || false
    },
    seedDB: true
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
===============================================
Used when process.env.NODE_ENV = 'production'
===============================================
//This file adds config settings and overwrites config settings in the ./default.ts file
//process.env.NODE_ENV is utilized in config/config.ts
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.prodEnv = {
    port: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).PORT || 8443,
    // Binding to 127.0.0.1 is safer in production.
    host: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).HOST || '0.0.0.0',
    mongo: {
        uri: 'mongodb://localhost/prod',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).MONGODB_DEBUG || false
    },
    seedDB: true
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
======================================================================================
Used when process.env.NODE_ENV is equal to 'test'
======================================================================================
//This file adds config settings and overwrites config settings in the ./default.ts file
//process.env.NODE_ENV is utilized in config/config.ts
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEnv = {
    port: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).PORT || 7001,
    mongo: {
        uri: 'mongodb://localhost/test',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: __webpack_require__.i({"ENV":"development","NODE_ENV":"development"}).MONGODB_DEBUG || false
    },
    seedDB: true
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * GET     /api/user              ->  allUsers
 * POST    /api/user              ->  create
 * GET     /api/user/:id          ->  show
 * PUT     /api/user/:id/password ->  changePassword
 * DELETE  /api/user/:id          ->  destroy
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(1);
var auth = __webpack_require__(8);
var UserController = __webpack_require__(7);
var router = express.Router();
exports.userRoutes = router;
router.get('/', auth.hasRole('admin'), UserController.index);
router.delete('/:id', auth.hasRole('admin'), UserController.destroy);
router.put('/:id/password', auth.isAuthenticated(), UserController.changePassword);
router.post('/', UserController.create, UserController.me);
router.post('/forgot', UserController.forgot, UserController.me);
router.post('/reset', UserController.reset, UserController.me);
router.get('/me', auth.isAuthenticated(), UserController.me);
router.get('/:id', auth.isAuthenticated(), UserController.show);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(1);
var user_model_1 = __webpack_require__(2);
var config_1 = __webpack_require__(0);
var local_router_1 = __webpack_require__(26);
var local_passport_1 = __webpack_require__(25);
// Passport configuration
local_passport_1.localSetup(user_model_1.default, config_1.default);
var router = express.Router();
exports.authRoutes = router;
// Import routes here
// this will setup the passport configuration from the *.passport file
router.use('/local', local_router_1.localRoutes);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var passport = __webpack_require__(4);
var passport_local_1 = __webpack_require__(41);
// This is the authentication process that happens in passport before the
// router callback function.
// When done is called the items will be passed to the callback function in
// local.router.ts
function localAuthenticate(User, email, password, done) {
    User.findOne({
        email: email.toLowerCase()
    }).exec()
        .then(function (user) {
        if (!user) {
            return done(null, false, {
                message: 'This email is not registered!'
            });
        }
        user.authenticate(password, function (authError, authenticated) {
            if (authError) {
                return done(authError);
            }
            if (!authenticated) {
                return done(null, false, {
                    message: 'This password is not correct!'
                });
            }
            else {
                return done(null, user);
            }
        });
    })
        .catch(function (err) { return done(err); });
}
function setup(User, config) {
    passport.use(new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, function (email, password, done) {
        return localAuthenticate(User, email, password, done);
    }));
}
exports.localSetup = setup;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(1);
var auth_service_1 = __webpack_require__(8);
var user_controller_1 = __webpack_require__(7);
var passport = __webpack_require__(4);
var router = express.Router();
exports.localRoutes = router;
// Only one route is necessary
// When local authentication is required the 'local' hook is known from setup
// in .passport.ts file
router.post('/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            res.status(401).json(error);
            return null;
        }
        if (!user) {
            res.status(404).json({ message: 'Something went wrong, please try again' });
            return null;
        }
        var token = auth_service_1.signToken(user._id, user.role);
        req.headers.token = token;
        req.user = user;
        next();
    })(req, res, next);
}, user_controller_1.me);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = __webpack_require__(3);
mongoose.Promise = Promise; // promise library plugin
var chalk = __webpack_require__(5);
var config_1 = __webpack_require__(0);
var Rx = __webpack_require__(11);
// Initialize Mongoose
function mongoConnect() {
    return Rx.Observable.create(function (observer) {
        mongoose.connect(config_1.default.mongo.uri, config_1.default.mongo.options, function (err) {
            // Log Error
            if (err) {
                console.error(chalk.bold.red('Could not connect to MongoDB!'));
                observer.error(err);
            }
            else {
                // Enabling mongoose debug mode if required
                mongoose.set('debug', config_1.default.mongo.debug);
                observer.next();
                observer.complete();
            }
        });
    });
}
exports.mongoConnect = mongoConnect;
;
function mongoDisconnect() {
    mongoose.disconnect(function (err) {
        console.log(chalk.bold.yellow('Disconnected from MongoDB.'));
    });
}
exports.mongoDisconnect = mongoDisconnect;
;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main application routes
 */
var user_router_1 = __webpack_require__(23);
var auth_router_1 = __webpack_require__(24);
function routes(app) {
    // Insert routes below
    app.use('/api/users', user_router_1.userRoutes);
    app.use('/auth', auth_router_1.authRoutes);
}
exports.default = routes;
;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(1);
var chalk = __webpack_require__(5);
var fs = __webpack_require__(6);
var http = __webpack_require__(16);
var https = __webpack_require__(17);
var config_1 = __webpack_require__(0);
var socketio_1 = __webpack_require__(15);
var express_1 = __webpack_require__(13);
var seed_1 = __webpack_require__(14);
var db_connect_1 = __webpack_require__(12);
var isSecure = config_1.default.https_secure && ("development" === 'production' || !"development");
// Initialize express
var app = express();
// Initialize http server
var server = http.createServer(app);
// If specified in the default assets, https will be used
if (isSecure) {
    var credentials = {
        key: fs.readFileSync(config_1.default.key_loc, 'utf8'),
        cert: fs.readFileSync(config_1.default.cert_loc, 'utf8')
    };
    server = https.createServer(credentials, app);
}
// Initialize the socketio with the respective server
var socketio = __webpack_require__(18)(server, {
    // serveClient: process.env.NODE_ENV !== 'production',
    path: '/socket.io-client'
});
db_connect_1.connect().subscribe(function (x) { }, function (err) { return console.log(err); }, function () {
    express_1.default(app);
    socketio_1.default(socketio);
    if (config_1.default.seedDB) {
        seed_1.default("development");
    }
    // Start the server on port / host
    server.listen(config_1.default.port, config_1.default.host, function () {
        var host = server.address().address;
        var port = server.address().port;
        if (true) {
            console.log(chalk.bold.cyan("\n\tEnvironment:\t\t\t " + ("development" || 'production') + "\n"));
            console.log(chalk.bold.cyan("\tMongoDB:") +
                chalk.bold.gray("\n\t - URI:\t\t\t\t " + config_1.default.mongo.uri + "\n"));
            if (false)
                console.log(chalk.bold.magenta("\t" + (isSecure ? 'HTTPS' : 'HTTP') + " Server") +
                    chalk.bold.gray("\n\tServer Address:\t\t\t " + (isSecure ? 'https' : 'http') + "://localhost:" + port + "\n"));
            else
                console.log(chalk.bold.magenta("\tWebPack DevServer:") +
                    chalk.bold.gray("\n\tServer Address:\t\t\t " + (isSecure ? 'https' : 'http') + "://localhost:1701\n"));
        }
    });
});
// export express app for testing
exports.default = app;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("composable-middleware");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("connect-mongo");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("method-override");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })
/******/ ]);