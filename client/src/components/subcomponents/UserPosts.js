import React from "react";
import UserPost from "./UserPost";

const UserPosts = ({
  posts,
  setModalImgText,
  setModalImgImage,
  openModalImg,
  setModalImgId,
  setModalImgLikesCount,
  setModalImgWhoLiked,
}) => {
  return (
    <>
      {posts !== null &&
        posts.map(
          ({ _id, image, description, username, likesCount, whoLiked }) => (
            <UserPost
              key={_id}
              _id={_id}
              image={image}
              description={description}
              username={username}
              likesCount={likesCount}
              setModalImgText={setModalImgText}
              setModalImgImage={setModalImgImage}
              openModalImg={openModalImg}
              setModalImgId={setModalImgId}
              setModalImgLikesCount={setModalImgLikesCount}
              setModalImgWhoLiked={setModalImgWhoLiked}
              whoLiked={whoLiked}
            />
          )
        )}
    </>
  );
};

export default UserPosts;
