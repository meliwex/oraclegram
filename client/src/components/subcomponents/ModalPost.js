import Modal from "react-modal";

const ModalPost = ({
  modalPostIsOpen,
  setModalPostIsOpen,
  uploadPost,
  selectedImage,
  isUploadErr,
  description,
  setDescription,
  closeModalPost,
  setSelectedImage,
}) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  Modal.setAppElement("#root");

  return (
    <Modal
      isOpen={modalPostIsOpen}
      onRequestClose={closeModalPost}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h3 className="mb-4">Add post</h3>
      <form encType="multipart/form-data" onSubmit={uploadPost}>
        <label
          className={`btn addPost-btn ${
            selectedImage !== null
              ? "btn-success"
              : isUploadErr
              ? "btn-danger"
              : "btn-info"
          }`}
        >
          Upload Image
          <input
            type="file"
            onChange={(e) => {
              setSelectedImage(e.target.files[0]);
            }}
            accept="image/x-png,image/jpeg"
            hidden
            className="m-auto"
          />
        </label>

        <input
          type="text"
          name="description"
          className="form-control mb-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="btn d-block m-auto btn-info">
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default ModalPost;
