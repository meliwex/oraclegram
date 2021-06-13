import { useState, useEffect } from "react";
import axios from "axios";
import GeneralPost from "./GeneralPost";
import Paginate from "./Paginate";
import { getAuthHeader } from "../../utils/token";

const GeneralPosts = ({
  postsLength,
  posts,
  setLogedIn,
  pageCount,
  onPageChange,
  likePost,
  unlikePost,
  isNoPosts,
}) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios
      .get(`/v1/users`, {
        headers: getAuthHeader(),
      })
      .then(({ data }) => {
        setUserId(data._id);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403 || status === 401) setLogedIn(false);
      });
  }, []);

  return (
    <>
      {postsLength > 0 && userId !== null && (
        <>
          {posts.map(
            ({ _id, image, description, username, likesCount, whoLiked }) => {
              return (
                <GeneralPost
                  key={_id}
                  _id={_id}
                  image={image}
                  description={description}
                  username={username}
                  likesCount={likesCount}
                  whoLiked={whoLiked}
                  userId={userId}
                  likePost={likePost}
                  unlikePost={unlikePost}
                />
              );
            }
          )}
          <Paginate
            postsLength={posts.length}
            pageCount={pageCount}
            onPageChange={onPageChange}
          />
        </>
      )}

      {isNoPosts && (
        <>
          <h3 className="mt-5"> No posts yet :(</h3>
          <p className="h4">Maybe you should follow to someone</p>
        </>
      )}
      <></>
    </>
  );
};

export default GeneralPosts;
