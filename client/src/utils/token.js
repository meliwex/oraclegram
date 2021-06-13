exports.getToken = function () {
  return localStorage.getItem("token");
};

exports.removeToken = function () {
  return localStorage.removeItem("token");
};

exports.setToken = function (token) {
  return localStorage.setItem("token", token);
};

exports.getAuthHeader = function () {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};
