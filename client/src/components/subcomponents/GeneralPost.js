import { useState, useEffect } from "react";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";

const GeneralPost = ({
  _id,
  image,
  username,
  description,
  likesCount,
  whoLiked,
  userId,
  likePost,
  unlikePost,
}) => {
  const [likeClicked, setLikeClicked] = useState(false);

  useEffect(() => {
    if (whoLiked.includes(userId)) {
      setLikeClicked(true);
    } else {
      setLikeClicked(false);
    }
  }, []);

  return (
    <div id={_id} className="card mb-4 " style={{ maxWidth: "50rem" }}>
      <img className="" src={`data:image/png;base64, ${image}`} alt="PostImg" />
      <div className="card-body">
        <h5 className="card-title">
          <a href={`${username}`}>{username}</a>
        </h5>
        {description && <p className="card-text mb-3">{description}</p>}
        {likeClicked ? (
          <>
            <button
              type="button"
              className="btn p-0 pl-2 border rounded pr-2 mr-2  "
              onClick={() => {
                unlikePost(_id);
                setLikeClicked(false);
              }}
            >
              <FcLike className="h1" />
            </button>
            {likesCount} Likes
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn p-0 pl-2 border rounded pr-2 mr-2 "
              onClick={() => {
                likePost(_id);
                setLikeClicked(true);
              }}
            >
              <FcLikePlaceholder className="h1" />
            </button>
            {likesCount} Likes
          </>
        )}
      </div>
    </div>
  );
};

export default GeneralPost;
