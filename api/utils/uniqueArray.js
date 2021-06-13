exports.uniqueArray = function (array) {
  const unique = [];

  for (i = 0; i < array.length; i++) {
    if (!unique.includes(array[i])) unique.push(array[i]);
  }
  return unique;
};
