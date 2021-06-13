import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import User from "./User";
import Loader from "./subcomponents/Loader";
import LoadingBlock from "./subcomponents/LoadingBlock";
import GeneralPosts from "./subcomponents/GeneralPosts";
import UserMayKnow from "./subcomponents/UserMayKnow";
import Title from "../utils/Title";
import { getAuthHeader } from "../utils/token";

const Home = ({ logedIn, setLogedIn, token }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isPaginationClicked, setIsPaginationClicked] = useState(false);
  const [isLikeOrUnlike, setIsLikeOrUnlike] = useState(false);
  const [isFollowOrUnFollow, setIsFollowOrUnFollow] = useState(false);
  const [peopleMayKnow, setPeopleMayKnow] = useState([]);
  const [isNoPosts, setIsNotPosts] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const onPageChange = (page) => {
    setIsPaginationClicked(true);
    setOffset(page.selected);
  };

  useEffect(() => {
    axios
      .get(`/v1/users`, {
        headers: getAuthHeader(),
      })
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/v1/posts?limit=${limit}&offset=${offset}`, {
        headers: getAuthHeader(),
      })
      .then(({ data }) => {
        data.posts && setPosts(data.posts);

        if (data.posts.length === 0) {
          setIsNotPosts(true);
        } else {
          setIsNotPosts(false);
          setPageCount(data.postsCount / limit);

          if (posts !== data.posts && isPaginationClicked) {
            window.scrollTo(0, 0);
            setIsPaginationClicked(false);
          }
        }
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
  }, [offset, isLikeOrUnlike, isFollowOrUnFollow]);

  useEffect(() => {
    axios
      .get(`/v1/users/tofollow`, {
        headers: getAuthHeader(),
      })
      .then(({ data }) => {
        setPeopleMayKnow(data);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
  }, []);

  const likePost = (id) => {
    setIsLikeOrUnlike(false);

    axios
      .put(
        `/v1/posts/${id}/like`,
        {},
        {
          headers: getAuthHeader(),
        }
      )
      .then((res) => {
        setIsLikeOrUnlike(true);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
    setIsLikeOrUnlike(false);
  };
  const unlikePost = (id) => {
    setIsLikeOrUnlike(false);

    axios
      .put(
        `/v1/posts/${id}/unlike`,
        {},
        {
          headers: getAuthHeader(),
        }
      )
      .then((res) => {
        setIsLikeOrUnlike(true);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
    setIsLikeOrUnlike(true);
  };

  const follow = (id) => {
    setIsFollowOrUnFollow(false);

    axios
      .put(
        `/v1/follow`,
        { id },
        {
          headers: getAuthHeader(),
        }
      )
      .then(({ data }) => {
        setIsFollowOrUnFollow(true);
        const followings = data.followings;

        if (followings.includes(id)) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
    setIsFollowOrUnFollow(false);
  };

  const unfollow = (id) => {
    setIsFollowOrUnFollow(false);

    axios
      .put(
        `/v1/unfollow`,
        { id },
        {
          headers: getAuthHeader(),
        }
      )
      .then(({ data }) => {
        setIsFollowOrUnFollow(true);
        const followings = data.followings;

        if (followings.includes(id)) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
    setIsFollowOrUnFollow(false);
  };

  if (!loading)
    return (
      <Router>
        <Title title={"Posts"} />
        <Switch>
          <Redirect from="/signup" to="/" />
          <Route path="/" exact>
            <div className="container">
              <div className="user-info text-center ">
                <div className="user-info-block pt-4 pb-2">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-md-3 offset-md-3">
                      <div>
                        <h1 className="text-center mt-3">Posts</h1>
                        <p className="text-center mb-4">Home page</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div>
                        <a
                          href={`${user.username}`}
                          className="text-info my-acc-text"
                        >
                          My Account
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-7 col-lg-6">
                  {posts.length === 0 && pageCount && !isNoPosts && (
                    <Loader option={"general"} />
                  )}
                  <GeneralPosts
                    setLogedIn={setLogedIn}
                    postsLength={posts.length}
                    posts={posts}
                    pageCount={pageCount}
                    onPageChange={onPageChange}
                    likePost={likePost}
                    unlikePost={unlikePost}
                    isNoPosts={isNoPosts}
                  />
                </div>
                <div className="col-xs-12 col-md-5 col-lg-4 offset-lg-2 mt-4 mb-4">
                  {peopleMayKnow.length > 0 && (
                    <>
                      <h5 className="mb-3 text-center ppl-may-know-text">
                        People you may know
                      </h5>
                      <ul className="list-group">
                        {peopleMayKnow.map(
                          ({ _id, profileImage, username }) => (
                            <UserMayKnow
                              key={_id}
                              _id={_id}
                              profileImage={profileImage}
                              username={username}
                              follow={follow}
                              unfollow={unfollow}
                            />
                          )
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Route>
          <Route path={`/:username`}>
            <User
              setLogedIn={setLogedIn}
              logedIn={logedIn}
              likePost={likePost}
              unlikePost={unlikePost}
              follow={follow}
              unfollow={unfollow}
              userInfo={userInfo}
              isFollowed={isFollowed}
              setIsFollowed={setIsFollowed}
              setUserInfo={setUserInfo}
              isFollowOrUnFollow={isFollowOrUnFollow}
              isLikeOrUnlike={isLikeOrUnlike}
            />
          </Route>
        </Switch>
      </Router>
    );

  return <LoadingBlock />;
};

export default Home;
