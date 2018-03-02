/*
 * 字典工具
 * author luobb
 */
export const Map = function() {
  this.map = new Array();
}

Map.prototype = {
  //struct
  struct: function(key, value) {
    var struct = {};
    struct.key = key;
    struct.value = value;

    return struct;
  },

  //add or update
  put: function(key, value) {
    var len = this.map.length;

    for (var i = 0; i < len; i++) {
      if (this.map[i].key === key) {
        this.map[i].value = value;
        return;
      }
    }

    this.map[len] = this.struct(key, value);
  },

  //get
  get: function(key) {
    for (var i = 0, len = this.map.length; i < len; i++) {
      if (this.map[i].key === key) {
        return this.map[i].value;
      }
    }
    return null;
  },

  //get values
  getValues: function(keys) {
    if (!keys) return null;

    var v = new Array();

    for (var i = 0; i < keys.length; i++) {
      v.push(this.get(keys[i]));
    }
    return v;
  },

  //delete
  remove: function(key) {
    var v;
    for (var i = 0, len = this.map.length; i < len; i++) {
      v = this.map.pop();
      if (v.key === key) continue;

      this.map.unshift(v);
    }
  },

  //keyset
  keySet: function() {
    var v = new Array();

    for (var i = 0, len = this.map.length; i < len; i++) {
      v.push(this.map[i].key);
    }

    return v.length == 0 ? null : v;
  },

  //valueSet
  valueSet: function() {
    var v = new Array();

    for (var i = 0, len = this.map.length; i < len; i++) {
      v.push(this.map[i].value);
    }

    return v.length == 0 ? null : v;
  },

  //check key
  containsKey: function(key) {
    for (var i = 0, len = this.map.length; i < len; i++) {
      if (this.map[i].key === key) return true;
    }

    return false;
  },

  //return map length
  getCount: function() {
    return this.map.length;
  },

  //check empty of map
  isEmpty: function() {
    return this.getCount() <= 0;
  }
};
