/*!
 * Module dependencies.
 */

var path = require('path');
var bson = require('bson');
var MongooseCollection = require(path.join(path.dirname(require.resolve('mongoose')), 'lib/collection'));
var DataStore = require('nedb');

// Override the function to generate new _id MongoDB suitable random string
DataStore.prototype.createNewId = function() {
  return new bson.ObjectID().toString();
}

/**
 * A [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) collection implementation.
 *
 * All methods methods from the [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) driver are copied and wrapped in queue management.
 *
 * @inherits Collection
 * @api private
 */

function NeDBCollection() {
  this.collection = null;
  MongooseCollection.apply(this, arguments);
}

/*!
 * Inherit from abstract Collection.
 */

NeDBCollection.prototype.__proto__ = MongooseCollection.prototype;

/**
 * Called when the connection opens.
 *
 * @api private
 */

NeDBCollection.prototype.onOpen = function() {
  var _this = this;

  var collection = new DataStore({ filename: (_this.conn.options.dbpath || '.') + '/' + _this.name + '.db' });

  collection.loadDatabase(function (err) {
    if (err) {
      _this.conn.emit('error', err);
    } else {
      _this.collection = collection;
      MongooseCollection.prototype.onOpen.call(_this);
    }
  });
};

/**
 * Called when the connection closes
 *
 * @api private
 */

NeDBCollection.prototype.onClose = function() {
  MongooseCollection.prototype.onClose.call(this);
};


/*!
 * Copy the collection methods and make them subject to queues
 */

function iter(i) {
  NeDBCollection.prototype[i] = function() {
    if (this.buffer) {
      this.addQueue(i, arguments);
      return;
    }

    var collection = this.collection,
        args = arguments,
        _this = this;

    return collection[i].apply(collection, args);
  };
}

for (var i in DataStore.prototype) {
  try {
    if (typeof DataStore.prototype[i] !== 'function') {
      continue;
    }
  } catch (e) {
    continue;
  }

  iter(i);
}


/**
 * Retreives information about this collections indexes.
 *
 * @param {Function} callback
 * @method getIndexes
 * @api public
 */

NeDBCollection.prototype.getIndexes = NeDBCollection.prototype.indexInformation;

/*!
 * Module exports.
 */

module.exports = NeDBCollection;
