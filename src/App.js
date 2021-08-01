import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Signup from "./components/signup.component";
import Classes from "./components/classes.component";
import Player from "./components/class-player.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.checkLogin = this.checkLogin.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined
    })
  }

  checkLogin() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user.id,
      });
    }
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/classes"} className="navbar-brand" style={{marginLeft: "10px"}}>
            Swayzee
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/classes"} className="nav-link">
                Classes
              </Link>
            </li>
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/classes"} className="nav-link" onClick={this.logOut}>
                  Log Out
                </Link>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/signup"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/classes"]} component={Classes} />
            <Route path="/classes/:id" 
              render={(props) => <Player {...props} currentUser={currentUser} />}
            />
            <Route exact path="/login"
              render={(props) => <Login {...props} checkLogin={this.checkLogin} />}
            />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
