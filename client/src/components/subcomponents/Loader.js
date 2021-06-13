import ContentLoader from "react-content-loader";

const Loader = ({ option }) => {
  if (option === "general") {
    return <h5 className="loading-text">Loading...</h5>;
  }

  return (
    <ContentLoader
      speed={2}
      className="col-4 mt-0 mb-4 loader"
      height={350}
      viewBox="0 0 400 400"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" className="col-4" height="400" />
    </ContentLoader>
  );
};

export default Loader;
