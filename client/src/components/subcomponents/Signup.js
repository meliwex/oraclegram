import { useState } from "react";
import axios from "axios";
import { setToken } from "../../utils/token";

const Signup = ({ setLogedIn }) => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertText, setAlertText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      fullname,
      username,
      password,
    };
    axios
      .post(`/v1/users/signup`, user)
      .then(({ data }) => {
        if (data.token) {
          setToken(data.token);
          setLogedIn(true);
        } else {
          if (data.message.errors.username)
            throw "There is a user with that username";
        }
      })
      .catch((err) => {
        let message;
        if (typeof err === "string") {
          message = err;
        } else if (err.data && err.response.data.message) {
          message = err.response.data.message;
        } else if (err.response.data.errors[0].msg) {
          message = err.response.data.errors[0].msg;
        }

        setAlertText(message);
      });
  };

  return (
    <>
      <form className="col-6 mt-5 form" onSubmit={handleSubmit}>
        {alertText && (
          <div className="alert alert-danger" role="alert">
            {alertText}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            type="text"
            id="fullName"
            className="form-control"
            aria-describedby="TextHelp"
            required
          />
        </div>
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
          Have an account?
          <a href="/" className="log-info">
            Log in
          </a>
        </p>
        <button type="submit" className="btn btn-primary">
          Sign up
        </button>
      </form>
    </>
  );
};

export default Signup;
