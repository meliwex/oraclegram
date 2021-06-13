import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";

Modal.setAppElement("#root");

const ModalImg = ({
  modalImgIsOpen,
  setModalImgIsOpen,
  modalImgImage,
  modalImgText,
  modalImgId,
  modalImgWhoLiked,
  modalImgLikesCount,
  setIsDeletePost,
  deletePost,
  likePost,
  unlikePost,
  userId,
}) => {
  const closeModal = () => setModalImgIsOpen(false);
  const [isLikeClicked, setIsLikeClicked] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const customStyles = {
    content: {
      width: `${windowWidth}px`,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    if (window.innerWidth < 500) setWindowWidth(window.innerWidth / 1.1);
    else if (window.innerWidth < 1000) setWindowWidth(window.innerWidth / 1.8);
    else setWindowWidth(window.innerWidth / 2.2);
  }, []);

  useEffect(() => {
    if (modalImgWhoLiked !== null && userId && modalImgId) {
      if (modalImgWhoLiked.includes(userId)) {
        setIsLikeClicked(true);
      } else {
        setIsLikeClicked(false);
      }
    }
  }, [userId, modalImgWhoLiked, modalImgId]);

  return (
    <Modal
      isOpen={modalImgIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <img
        className="card-img-top"
        src={`data:image/png;base64, ${modalImgImage}`}
        alt="Post"
      />
      <p className="card-text mt-4">{modalImgText}</p>
      {isLikeClicked ? (
        <>
          <button
            type="button"
            className="btn p-0 pl-2 border rounded pr-2 mr-2 "
            onClick={() => {
              unlikePost(modalImgId);
              setIsLikeClicked(false);
            }}
          >
            <FcLike className="h1" />
          </button>
          {modalImgLikesCount} Likes
        </>
      ) : (
        <>
          <button
            type="button"
            className="btn p-0 pl-2 border rounded pr-2 mr-2 "
            onClick={() => {
              likePost(modalImgId);
              setIsLikeClicked(true);
            }}
          >
            <FcLikePlaceholder className="h1" />
          </button>
          {modalImgLikesCount} Likes
        </>
      )}
      {deletePost && (
        <div className="text-right">
          <button
            className="btn btn-danger"
            onClick={() => {
              deletePost(modalImgId);
              setIsDeletePost(true);
            }}
          >
            Delete Post
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ModalImg;
