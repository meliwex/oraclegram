const mongoose = require("mongoose");
const { body } = require("express-validator");
const { IsValidate, getErrors } = require("../utils/validation");
const { encodeBase64 } = require("../utils/base64");
const { uniqueArray } = require("../utils/uniqueArray");

const Post = mongoose.model("Post");
const User = mongoose.model("User");

exports.validate = function (method) {
  switch (method) {
    case "addPost":
      return [body("description").escape()];
      break;
  }
};

exports.getPostsByUsername = async function (req, res) {
  try {
    const username = req.params.username;
    const posts = await Post.find({ username }).sort("-createdAt");
    res.send(posts);
  } catch (err) {
    res.send({ message: err });
  }
};

exports.getPosts = async function (req, res) {
  try {
    const id = req.user.id;
    const { limit, offset } = req.query;

    const account = await User.findById(id);
    const followings = account.followings;

    let posts = [];
    for (let i = 0; i < followings.length; i++) {
      const followingsPosts = await Post.find({ userId: followings[i] });

      for (let j = 0; j < followingsPosts.length; j++)
        posts.push(followingsPosts[j]);
    }

    posts.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    let results = [];
    for (let i = limit * offset; i < (offset + 1) * limit; i++) {
      if (posts[i]) results.push(posts[i]);
    }

    res.send({
      postsCount: posts.length,
      posts: results,
    });
  } catch (err) {
    res.send({ message: err });
  }
};

exports.addPost = async function (req, res) {
  try {
    if (!IsValidate(req))
      return res.status(400).send({ errors: getErrors(req) });

    const img64 = encodeBase64(req.file.path);
    const id = req.user.id;

    const author = await User.findById(id);

    const newPost = new Post({
      ...req.body,
      username: author.username,
      userId: id,
      image: img64,
    });

    await newPost.save();
    res.send(newPost);
  } catch (err) {
    res.send({ message: err });
  }
};

exports.deletePost = async function (req, res) {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);

    res.send("ok");
  } catch (err) {
    res.send({ message: err });
  }
};

exports.likePost = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { whoLiked: userId },
      },
      { multi: true, useFindAndModify: false }
    );

    await Post.findByIdAndUpdate(
      postId,
      {
        $push: { whoLiked: userId },
      },
      { useFindAndModify: false }
    );

    let post = await Post.findById(postId);

    let uniqueWhoLiked = uniqueArray(post.whoLiked);
    await Post.findByIdAndUpdate(
      postId,
      {
        likesCount: uniqueWhoLiked.length,
      },
      { useFindAndModify: false }
    );

    post = await Post.findById(postId);
    res.send(post);
  } catch (err) {
    res.send({ message: err });
  }
};

exports.unlikePost = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { whoLiked: userId },
      },
      { multi: true, useFindAndModify: false }
    );

    let post = await Post.findById(postId);
    await Post.findByIdAndUpdate(
      postId,
      {
        likesCount: post.whoLiked.length,
      },
      { useFindAndModify: false }
    );

    post = await Post.findById(postId);
    res.send(post);
  } catch (err) {
    res.send({ message: err });
  }
};
