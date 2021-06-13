import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../assets/logo.png";
import { getAuthHeader, removeToken } from "../utils/token";

const Header = ({ logedIn, setLogedIn }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);

  function logout() {
    removeToken();
    setLogedIn(false);
  }

  useEffect(() => {
    setSearchUsers([]);

    if (searchInput !== "") {
      axios
        .get(`/v1/users/search?q=${searchInput}`, {
          headers: getAuthHeader(),
        })
        .then(({ data }) => {
          setSearchUsers(data);
        })
        .catch((err) => {
          const status = err.response && err.response.status;
          if (status === 403 || status === 401) setLogedIn(false);
        });
    }
  }, [searchInput]);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a href="/" className="navbar-brand">
            <img src={Logo} alt="Logo" width="65" height="65" className="" />
            oraclegram
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {logedIn && (
              <>
                <form>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                  />
                </form>

                <div className="search-users-block">
                  <ul className="list-group">
                    {searchInput !== "" &&
                      searchUsers.map(({ _id, username, profileImage }) => (
                        <li key={_id} className="list-group-item">
                          <div className="follow-user-info d-flex align-items-center justify-content-between">
                            <a href={`/${username}`}>
                              <div className="d-flex align-items-center">
                                <img
                                  src={`data:image/png;base64, ${profileImage}`}
                                  alt="profile pic"
                                  className="follow-user-img"
                                />
                                <div className="ml-3 mayknow-username">
                                  {username}
                                </div>
                              </div>
                            </a>

                            <div className="text-right align-items-center d-flex justify-content-center"></div>
                          </div>
                        </li>
                      ))}
                  </ul>

                  {searchUsers.length === 0 && searchInput !== "" && (
                    <div className="not-found mt-2">
                      <h6 className="not-foundUser-text">Sorry, not found</h6>
                    </div>
                  )}
                </div>
              </>
            )}
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
              <li className="nav-item"></li>
            </ul>
            {logedIn && (
              <button className="btn" type="button" onClick={logout}>
                Log out
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
