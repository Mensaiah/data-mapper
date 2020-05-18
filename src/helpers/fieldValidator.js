module.exports = {
  isDate: data => {
    if (typeof data === 'number') {
      return false;
    }

    const date = new Date(data);
    if (date.toString() === 'Invalid Date') {
      return false;
    }

    return true;
  },

  isNumber: data => {
    if (typeof data === 'number') {
      return true;
    }
    return false;
  },

  isString: data => {
    if (typeof data === 'string') {
      return true;
    }
    return false;
  },

  isObjEmpty: obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  },

  checkLogic: l => {
    if (l === 'lt') {
      return '<';
    } else if (l === 'gt') {
      return '>';
    } else if (l === 'eq') {
      return '=';
    } else if (l === 'eqc') {
      return 'ILIKE';
    }
  }
};
