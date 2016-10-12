/*!
 * Module dependencies.
 */

var path = require('path');
var MongooseConnection = require(path.join(path.dirname(require.resolve('mongoose')), 'lib/connection'));
var STATES = require(path.join(path.dirname(require.resolve('mongoose')), 'lib/connectionstate'));
var fs = require('fs');

/**
 * A [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) connection implementation.
 *
 * @inherits Connection
 * @api private
 */

function NeDBConnection() {
  MongooseConnection.apply(this, arguments);
  this._listening = false;
}

/**
 * Expose the possible connection states.
 * @api public
 */

NeDBConnection.STATES = STATES;

/*!
 * Inherits from Connection.
 */

NeDBConnection.prototype.__proto__ = MongooseConnection.prototype;

/**
 * Opens the connection to MongoDB.
 *
 * @param {Function} fn
 * @return {Connection} this
 * @api private
 */

NeDBConnection.prototype.doOpen = function(fn) {
  var _this = this;

  if (_this.options && !_this.options.dbpath)
    _this.options.dbpath = '.';

  fs.access(_this.options.dbpath, fs.W_OK, function(err) {
    if (err) return fn(err);

    fn();
  });

  return this;
};

/**
 * Switches to a different database using the same connection pool.
 *
 * Returns a new connection object, with the new db.
 *
 * @param {String} name The database name
 * @return {Connection} New Connection Object
 * @api public
 */

NeDBConnection.prototype.useDb = function(name) {
  throw new Error("Not implemented");
};

/**
 * Opens a connection to a MongoDB ReplicaSet.
 *
 * See description of [doOpen](#NeDBConnection-doOpen) for server options. In this case `options.replset` is also passed to ReplSetServers.
 *
 * @param {Function} fn
 * @api private
 * @return {Connection} this
 */

NeDBConnection.prototype.doOpenSet = function(fn) {
  throw new Error("Not implemented");
};

/**
 * Closes the connection
 *
 * @param {Function} fn
 * @return {Connection} this
 * @api private
 */

NeDBConnection.prototype.doClose = function(fn) {
  throw new Error("Not implemented");
};

/**
 * Prepares default connection options for the node-mongodb-native driver.
 *
 * _NOTE: `passed` options take precedence over connection string options._
 *
 * @param {Object} passed options that were passed directly during connection
 * @param {Object} [connStrOptions] options that were passed in the connection string
 * @api private
 */

NeDBConnection.prototype.parseOptions = function(passed, connStrOpts) {
  var o = passed || {};
  return o;
};

/*!
 * Module exports.
 */

module.exports = NeDBConnection;
