import {BrowserRouter as Router, Switch} from 'react-router-dom';
//Routing
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
//Screens
import PrivateScreen from './components/screen/PrivateScreen';
import HomeScreen from './components/screen/HomeScreen';
import LoginScreen from './components/screen/LoginScreen';
import RegisterScreen from './components/screen/RegisterScreen';
import ForgotPasswordScreen from './components/screen/ForgotPasswordScreen';
import ResetPasswordScreen from './components/screen/ResetPasswordScreen';
//background
import Map from './components/Layouts/Map';
function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
        <PrivateRoute exact path="/" component={PrivateScreen}/>
        <PublicRoute exact path="/home" component={()=><Map><HomeScreen/></Map>}/>
        <PublicRoute exact path="/login" component={()=><Map><LoginScreen/></Map>}/>
        <PublicRoute exact path="/register" component={()=><Map><RegisterScreen/></Map>}/>
        <PublicRoute exact path="/forgotpassword" component={()=><Map><ForgotPasswordScreen/></Map>}/>
        <PublicRoute exact path="/passwordreset/:resetToken" component={()=><Map><ResetPasswordScreen/></Map>}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
