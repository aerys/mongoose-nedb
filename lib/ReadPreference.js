var ReadPreference = function(mode, tags, options) {
  if(!(this instanceof ReadPreference)) {
    return new ReadPreference(mode, tags, options);
  }

  this._type = 'ReadPreference';
  this.mode = mode;
  this.tags = tags;
  this.options =  options;

  // If no tags were passed in
  if(tags && typeof tags == 'object' && !Array.isArray(tags)) {
    this.options = tags;
    this.tags = null;
  }
}

ReadPreference.prototype.isValid = function(mode) {
  return true;
}

ReadPreference.prototype.toObject = function() {
  return {};
}

ReadPreference.prototype.toJSON = function() {
  return this.toObject();
}

module.exports = function readPreference(pref, tags) {
  return new ReadPreference();
};
