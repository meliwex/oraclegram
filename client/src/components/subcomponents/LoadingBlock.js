const LoadingBlock = ({ notFound }) => {
  return (
    <div className="container">
      <div className="user-info text-center ">
        <div className="user-info-block pt-4 pb-2">
          {notFound ? <h1>Not Found 404 :(</h1> : <h1>Loading...</h1>}
        </div>
      </div>
    </div>
  );
};

export default LoadingBlock;
