import { useState } from "react";

const UserMayKnow = ({ _id, profileImage, username, follow, unfollow }) => {
  const [followIsClicked, setFollowIsClicked] = useState(false);

  return (
    <li className="list-group-item pt-0 pb-0 ">
      <div className="follow-user-info d-flex align-items-center justify-content-between">
        <a href={`/${username}`}>
          <div className="d-flex align-items-center">
            <img
              src={`data:image/png;base64, ${profileImage}`}
              alt="profile pic"
              className="follow-user-img"
            />
            <div className="ml-3 mayknow-username">{username}</div>
          </div>
        </a>

        <div className="text-right align-items-center d-flex justify-content-center">
          {followIsClicked ? (
            <button
              className="btn btn-md btn-follow-unfollow btn-danger ml-auto pr-5 pl-5 mb-4 mt-4"
              onClick={() => {
                unfollow(_id);
                setFollowIsClicked(false);
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="btn btn-md btn-follow-unfollow btn-dark ml-auto pr-5 pl-5 mb-4 mt-4"
              onClick={() => {
                follow(_id);
                setFollowIsClicked(true);
              }}
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default UserMayKnow;
