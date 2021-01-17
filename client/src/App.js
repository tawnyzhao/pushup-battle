import Cam from "./components/Cam";
import { useState } from "react";
import "./App.css";
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Lobby from "./components/Lobby";
import Landing from './components/Landing';

function App() {
  let [session, setSession] = useState({});
  console.log(session);
  return (
    <Router> 
      <div className="App">
        <Switch>
          <Route path="/:id">
            <Lobby session={session}/>
          </Route>
          <Route exact path="/">
            {
              Object.keys(session).length != 0 ? 
              <Redirect to={`/${session.roomID}`} /> :
              <Landing updateSession={setSession}/>
            }
          </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
