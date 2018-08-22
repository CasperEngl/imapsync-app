/*
eslint

no-extend-native: 0,
*/

String.prototype.trimLiteral = function () {
  if (this.length === 0) {
    return this;
  }

  return this
    .replace(/\n/gm, '') // Replace newlines
    .replace(/ {2}/gm, ''); // Replace double spaces
};
