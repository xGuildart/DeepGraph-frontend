import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/views/Login";
import Register from "./components/views/Register";
import Forgot from "./components/views/Forgot";
import ViewData from "./components/views/ViewData";
import { Store } from "./store/Store";

const Auth = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/view" component={ViewData} />
        <Route path="/forgot-password" component={Forgot} />
        <Route path="/" component={Login} />
      </Switch>
    </Router >
  );
};

export default Auth;
