import Login from "./subcomponents/Login";
import Signup from "./subcomponents/Signup";
import Title from "../utils/Title";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const Form = ({ setLogedIn }) => {
  return (
    <Router>
      <Title title="Authentication" />
      <div className="d-flex main-content">
        <div className="main-image col-6"></div>
        <Switch>
          <Route path="/" exact>
            <Login setLogedIn={setLogedIn} />
          </Route>
          <Route path="/signup">
            <Signup setLogedIn={setLogedIn} />
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default Form;
