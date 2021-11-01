const mongoose = require("mongoose");
const { encodeBase64 } = require("../utils/base64");
const { uniqueArray } = require("../utils/uniqueArray");

const User = mongoose.model("User");

exports.getUser = async function (req, res) {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).select("-password");

    res.send(user);
  } catch (err) {
    res.send({ message: err });
  }
};

exports.getPersonalUser = async function (req, res) {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("-password");

    res.send(user);
  } catch (err) {
    res.send({ message: err });
  }
};

exports.follow = async function (req, res) {
  try {
    const userId = req.user.id;
    const userToFollowId = req.body.id;

    await User.findByIdAndUpdate(
      userToFollowId,
      {
        $pull: { followers: userId },
      },
      { multi: true, useFindAndModify: false }
    );

    await User.findByIdAndUpdate(
      userToFollowId,
      {
        $push: { followers: userId },
      },
      { useFindAndModify: false }
    );

    const userToFollow = await User.findById(userToFollowId);
    const uniqueFollowers = uniqueArray(userToFollow.followers);
    await User.findByIdAndUpdate(
      userToFollowId,
      {
        followersCount: uniqueFollowers.length,
      },
      { useFindAndModify: false }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followings: userToFollowId },
      },
      { multi: true, useFindAndModify: false }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { followings: userToFollowId },
      },
      { useFindAndModify: false }
    );

    let user = await User.findById(userId);
    const uniqueFollowings = uniqueArray(user.followings);
    await User.findByIdAndUpdate(
      userId,
      {
        followingsCount: uniqueFollowings.length,
      },
      { useFindAndModify: false }
    );

    user = await User.findById(userId);
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

exports.unfollow = async function (req, res) {
  try {
    const userId = req.user.id; // KLJSD
    const userToFollowId = req.body.id; // bounty

    await User.findByIdAndUpdate(
      userToFollowId,
      {
        $pull: { followers: userId },
      },
      { multi: true, useFindAndModify: false }
    );

    const userToFollow = await User.findById(userToFollowId);
    await User.findByIdAndUpdate(
      userToFollowId,
      {
        followersCount: userToFollow.followers.length,
      },
      { useFindAndModify: false }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followings: userToFollowId },
      },
      { multi: true, useFindAndModify: false }
    );

    let user = await User.findById(userId);
    await User.findByIdAndUpdate(
      userId,
      {
        followingsCount: user.followings.length,
      },
      { useFindAndModify: false }
    );

    user = await User.findById(userId);
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

exports.changeProfileImage = async function (req, res) {
  try {
    const userId = req.user.id;
    const img64 = encodeBase64(req.file.path);

    let user = await User.findById(req.user.id);

    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: img64,
      },
      { new: true, useFindAndModify: false }
    );

    user = await User.findById(userId);
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

exports.usersToFollow = async function (req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    const userFollowings = user.followings.filter(
      (following) => following !== ""
    );

    const users = await User.find({
      _id: { $nin: [userId, ...userFollowings] },
    })
      .limit(5)
      .select("-password")
      .sort({ followersCount: -1 });

    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

exports.searchUser = async function (req, res) {
  try {
    const searchInput = req.query.q;
    const userId = req.user.id;

    const user = await User.findById(userId);

    const usersFinded = await User.find({
      _id: { $nin: [userId] },
      username: new RegExp("^" + searchInput, "gi"),
    }).limit(5);

    res.send(usersFinded);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
