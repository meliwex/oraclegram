import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import axios from "axios";
import ModalImg from "./subcomponents/ModalImg";
import Loader from "./subcomponents/Loader";
import ModalPost from "./subcomponents/ModalPost";
import LoadingBlock from "./subcomponents/LoadingBlock";
import UserPosts from "./subcomponents/UserPosts";
import Title from "../utils/Title";
import { getAuthHeader } from "../utils/token";

const User = ({
  logedIn,
  setLogedIn,
  likePost,
  unlikePost,
  follow,
  unfollow,
  isFollowed,
  userInfo,
  setIsFollowed,
  setUserInfo,
  isFollowOrUnFollow,
  isLikeOrUnlike,
}) => {
  const match = useParams();
  const username = match.username;
  if (!username) setLogedIn(false);

  const loadingPosts = [1, 2, 3, 4, 5, 6];
  const [modalImgIsOpen, setModalImgIsOpen] = useState(false);
  const [modalImgImage, setModalImgImage] = useState("");
  const [modalImgText, setModalImgText] = useState("");
  const [modalImgId, setModalImgId] = useState("");
  const [modalImgLikesCount, setModalImgLikesCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isPersonalAcc, setIsPersonalAcc] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalPostIsOpen, setModalPostIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadErr, setIsUploadErr] = useState(false);
  const [description, setDescription] = useState("");
  const [isDeletePost, setIsDeletePost] = useState(false);
  const [modalImgWhoLiked, setModalImgWhoLiked] = useState(null);
  const [userId, setUserId] = useState(null);

  const openModalImg = () => setModalImgIsOpen(true);
  const openModalPost = () => setModalPostIsOpen(true);
  const closeModalPost = () => setModalPostIsOpen(false);

  useEffect(() => {
    axios
      .get(`/v1/users`, {
        headers: getAuthHeader(),
      })
      .then(({ data }) => {
        setUserId(data._id);

        if (username === data.username) {
          setIsPersonalAcc(true);
          setUserInfo(data);
        } else {
          const id = data._id;

          axios
            .get(`/v1/users/${username}`, {
              headers: getAuthHeader(),
            })
            .then((res) => {
              const followers = res.data.followers;
              if (followers.includes(id)) {
                setIsFollowed(true);
              } else {
                setIsFollowed(false);
              }
              setIsPersonalAcc(false);
              setUserInfo(res.data);
            })
            .catch((err) => {
              setNotFound(true);
              const status = err.response && err.response.status;
              if (status === 403 || status === 401) setLogedIn(false);
            });
        }
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if ((status && status === 403) || status === 401) setLogedIn(false);
      });
  }, [isFollowOrUnFollow]);

  useEffect(() => {
    axios
      .get(`/v1/posts/${username}`, {
        headers: getAuthHeader(),
      })
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if ((status && status === 403) || status === 401) setLogedIn(false);
      });

    setIsDeletePost(false);
  }, [modalPostIsOpen, modalImgIsOpen, isLikeOrUnlike]);

  const changeAvatar = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("image", selectedFile);

    axios
      .put(`/v1/user/avatar`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeader(),
        },
      })
      .then((res) => {
        setUserInfo({
          ...userInfo,
          profileImage: res.data.profileImage,
        });
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if ((status && status === 403) || status === 401) setLogedIn(false);
      });
  };

  const uploadPost = (e) => {
    e.preventDefault();

    if (selectedImage === null) {
      setIsUploadErr(true);
    } else {
      const form = new FormData();
      form.append("image", selectedImage);
      form.append("description", description);

      axios
        .post(`/v1/posts`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeader(),
          },
        })
        .then((res) => {
          closeModalPost();
          setSelectedImage(null);
        })
        .catch((err) => {
          const status = err.response && err.response.status;
          if (status === 403 || status === 401) setLogedIn(false);
        });
    }
  };

  const deletePost = (id) => {
    axios
      .delete(`/v1/posts/${id}`, {
        headers: getAuthHeader(),
      })
      .then((res) => {
        setModalImgIsOpen(false);
        setLoading(true);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
  };

  if (isPersonalAcc === true) {
    return (
      <div className="container">
        <Title title={userInfo.username} />
        {!logedIn && <Redirect to="/" />}
        <div className="user-info text-center ">
          <div className="user-info-block pt-4 pb-2">
            <ModalPost
              modalPostIsOpen={modalPostIsOpen}
              setModalPostIsOpen={setModalPostIsOpen}
              uploadPost={uploadPost}
              selectedImage={selectedImage}
              isUploadErr={isUploadErr}
              description={description}
              setDescription={setDescription}
              closeModalPost={closeModalPost}
              setSelectedImage={setSelectedImage}
            />
            <div className="row">
              <div className="col-lg-2 offset-lg-5">
                <p className="mt-2">My account</p>
              </div>
              <div className="col-lg-3 offset-lg-2">
                <button className="btn btn-info" onClick={openModalPost}>
                  Add post
                </button>
              </div>
            </div>
            <div className="profile-logo">
              <img
                src={`data:image/png;base64, ${userInfo.profileImage}`}
                alt="Profile Image"
                className="profile-img"
              />
            </div>
            <div className="row user-info-block-follow">
              <div className="col-3">
                <div>
                  <p className="m-0 follow-info">Followers</p>
                  <p className="h2">{userInfo.followersCount}</p>
                </div>
              </div>
              <div className="col-3">
                <div>
                  <h1 className="user-username">{userInfo.username}</h1>
                  <p>{userInfo.fullname}</p>
                </div>
              </div>
              <div className="col-3">
                <div>
                  <p className="m-0 follow-info">Followings</p>
                  <p className="h2">{userInfo.followingsCount}</p>
                </div>
              </div>
            </div>
            <form encType="multipart/form-data" onSubmit={changeAvatar}>
              <label className="btn btn-default">
                File
                <input
                  type="file"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                  }}
                  accept="image/x-png,image/jpeg"
                  hidden
                />
              </label>
              <button type="submit" className="btn btn-info">
                Change Image
              </button>
            </form>
          </div>
        </div>
        <ModalImg
          setModalImgIsOpen={setModalImgIsOpen}
          modalImgIsOpen={modalImgIsOpen}
          modalImgImage={modalImgImage}
          modalImgLikesCount={modalImgLikesCount}
          modalImgText={modalImgText}
          modalImgId={modalImgId}
          modalImgWhoLiked={modalImgWhoLiked}
          deletePost={deletePost}
          setIsDeletePost={setIsDeletePost}
          likePost={likePost}
          unlikePost={unlikePost}
          userId={userId}
        />
        <div className="container">
          <div className="row mt-4">
            {loading ? (
              loadingPosts.map((it) => <Loader key={it} />)
            ) : (
              <UserPosts
                posts={posts}
                setModalImgImage={setModalImgImage}
                setModalImgText={setModalImgText}
                setModalImgId={setModalImgId}
                setModalImgLikesCount={setModalImgLikesCount}
                openModalImg={openModalImg}
                setModalImgWhoLiked={setModalImgWhoLiked}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else if (isPersonalAcc === false) {
    return (
      <div className="container">
        <Title title={userInfo.username} />
        {!logedIn && <Redirect to="/" />}
        <div className="user-info text-center ">
          <div className="user-info-block pt-4 pb-2">
            <div className="profile-logo">
              <img
                src={`data:image/png;base64, ${userInfo.profileImage}`}
                alt="Profile Image"
                className="profile-img"
              />
            </div>
            <div className="row user-info-block-follow">
              <div className="col-3">
                <div>
                  <p className="m-0 follow-info">Followers</p>
                  <p className="h2">{userInfo.followersCount}</p>
                </div>
              </div>
              <div className="col-5">
                <div>
                  <h1 className="user-username">{userInfo.username}</h1>
                  <p>{userInfo.fullname}</p>
                </div>
              </div>
              <div className="col-3">
                <div>
                  <p className="m-0 follow-info">Followings</p>
                  <p className="h2">{userInfo.followingsCount}</p>
                </div>
              </div>
            </div>
            {isFollowed ? (
              <button
                className="btn btn-danger btn-follow ml-auto pr-5 pl-5 mb-4"
                onClick={() => unfollow(userInfo._id)}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="btn btn-info btn-unfollow ml-auto pr-5 pl-5 mb-4 "
                onClick={() => follow(userInfo._id)}
              >
                Follow
              </button>
            )}
          </div>
        </div>
        <ModalImg
          setModalImgIsOpen={setModalImgIsOpen}
          modalImgIsOpen={modalImgIsOpen}
          modalImgImage={modalImgImage}
          modalImgText={modalImgText}
          modalImgId={modalImgId}
          modalImgLikesCount={modalImgLikesCount}
          modalImgWhoLiked={modalImgWhoLiked}
          userId={userId}
          likePost={likePost}
          unlikePost={unlikePost}
        />
        <div className="container">
          <div className="row">
            {loading ? (
              loadingPosts.map((it) => <Loader key={it} />)
            ) : (
              <UserPosts
                posts={posts}
                setModalImgImage={setModalImgImage}
                setModalImgText={setModalImgText}
                setModalImgId={setModalImgId}
                setModalImgLikesCount={setModalImgLikesCount}
                openModalImg={openModalImg}
                setModalImgWhoLiked={setModalImgWhoLiked}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return <LoadingBlock notFound={notFound} />;
};

export default User;
