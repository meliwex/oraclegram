const multer = require("multer");
const auth = require("../controllers/authController");
const post = require("../controllers/postController");
const user = require("../controllers/userController");
const jwt = require("../utils/jwt");

const upload = multer({ dest: "uploads/" });

module.exports = function (app) {
  // Authentication
  app.post("/v1/users/signup", auth.validate("signup"), auth.signup);
  app.post("/v1/users/login", auth.validate("login"), auth.login);

  // User
  app.get("/v1/users", jwt.authenticateToken, user.getPersonalUser);
  app.get("/v1/users/search", jwt.authenticateToken, user.searchUser);
  app.get("/v1/users/tofollow", jwt.authenticateToken, user.usersToFollow);
  app.get("/v1/users/:username", jwt.authenticateToken, user.getUser);
  app.put("/v1/follow", jwt.authenticateToken, user.follow);
  app.put("/v1/unfollow", jwt.authenticateToken, user.unfollow);

  // Post
  app.get("/v1/posts", jwt.authenticateToken, post.getPosts);
  app.delete("/v1/posts/:id", jwt.authenticateToken, post.deletePost);
  app.get(
    "/v1/posts/:username",
    jwt.authenticateToken,
    post.getPostsByUsername
  );
  app.post(
    "/v1/posts",
    post.validate("addPost"),
    jwt.authenticateToken,
    upload.single("image"),
    post.addPost
  );
  app.put("/v1/posts/:id/like", jwt.authenticateToken, post.likePost);
  app.put("/v1/posts/:id/unlike", jwt.authenticateToken, post.unlikePost);

  // Image
  app.put(
    "/v1/user/avatar",
    jwt.authenticateToken,
    upload.single("image"),
    user.changeProfileImage
  );
};
