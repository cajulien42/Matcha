import React, { Component } from 'react'
import { BrowserRouter as Router, /*Route,*/ Switch } from 'react-router-dom';

import NavBar from '../Components/NavBar/NavBarS';
import Home from '../Components/Home/HomeS';
import SignUp from '../Components/Forms/SignUp/SignUpS';
import Account from '../Components/Forms/Account/AccountS';
import Footer from './Footer';
import Profil from '../Components/Profil/ProfilS';
import Search from '../Components/Search/SearchS';
import Messages from '../Components/Messages/MessagesS';
import Matches from '../Components/Matches/MatchesS';
import SendMailReset from '../Components/Forms/SendMailReset/SendMailResetS';
import ResetPassword from '../Components/Forms/ResetPassword/ResetPasswordS';
import ConfirmEmail from '../Components/Forms/ConfirmEmail/ConfirmEmailS';
import PrivateRoute from './PrivateRoute';

class App extends Component {
  // console.log(Reset)
  render() {
    return (
      <Router>
          <div>
            <NavBar />
            <Switch>
              <PrivateRoute path="/" exact component={Home} />
              <PrivateRoute path="/home" component={Home} />
              <PrivateRoute path="/sign-up" component={SignUp} />
              <PrivateRoute path="/reset_password/:username/:token" component={ResetPassword} />
              <PrivateRoute path="/send_mail_reset" component={SendMailReset} />
              <PrivateRoute path="/account" component={Account} />
              <PrivateRoute path="/profil" component={Profil} />
              <PrivateRoute path="/search" component={Search} />
              <PrivateRoute path="/messages" component={Messages} />
              <PrivateRoute path="/matches" component={Matches} />
              <PrivateRoute path="/confirm/:username/:token" component={ConfirmEmail} />
            </Switch>
            <Footer />
          </div>
      </Router>
    );
  }
}

export default App
