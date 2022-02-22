import React from "react";

const Post = ({
  _id,
  image,
  description,
  likesCount,
  setModalImgImage,
  setModalImgText,
  setModalImgId,
  openModalImg,
  setModalImgLikesCount,
  setModalImgWhoLiked,
  whoLiked,
}) => {
  return (
    <div
      key={_id}
      onClick={() => {
        setModalImgId(_id);
        setModalImgImage(image);
        setModalImgText(description);
        setModalImgLikesCount(likesCount);
        setModalImgWhoLiked(whoLiked);
        openModalImg();
      }}
      className="col-lg-4 col-md-6  card-modal mb-4"
    >
      <div className="card post cursor">
        <img
          className="card-img-top "
          src={`data:image/png;base64, ${image}`}
          alt="Card cap"
        />
      </div>
    </div>
  );
};

export default Post;
