import { useState, useEffect } from "react";
import { getToken, removeToken } from "./utils/token";
import Form from "./components/Form";
import Header from "./components/Header";
import Home from "./components/Home";

function App() {
  const [logedIn, setLogedIn] = useState(getToken() ? true : false);

  useEffect(() => {
    if (!logedIn) removeToken();
  }, [logedIn]);

  return (
    <>
      <Header logedIn={logedIn} setLogedIn={setLogedIn} />

      {logedIn ? (
        <Home setLogedIn={setLogedIn} logedIn={logedIn} token={getToken()} />
      ) : (
        <Form setLogedIn={setLogedIn} />
      )}
    </>
  );
}

export default App;
