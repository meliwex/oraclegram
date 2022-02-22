import { useState } from "react";
import axios from "axios";
import { setToken } from "../../utils/token";

const Login = ({ setLogedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertText, setAlertText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username,
      password,
    };

    axios
      .post(`/v1/users/login`, user)
      .then(({ data }) => {
        setToken(data.token);
        setLogedIn(true);
      })
      .catch((err) => {
        const message = err.response.data.message;
        setAlertText(message);
      });

    setPassword("");
  };

  return (
    <>
      <form
        className="col-6 mt-5 form"
        onSubmit={handleSubmit}
        data-toggle="validator"
        // role="form"
      >
        {alertText && (
          <div className="alert alert-danger" role="alert">
            {alertText}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            className="form-control"
            aria-describedby="TextHelp"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="form-control"
            required
          />
        </div>
        <p>
          Don't have an account?
          <a href="/signup" className="log-info">
            Sign up
          </a>
        </p>
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
      </form>
    </>
  );
};

export default Login;
