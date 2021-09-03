import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import 'ionicons-npm/css/ionicons.min.css'
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/LandingPage';
import Main from './Components/Main';
import { configureStore } from './redux/configureStore';

function App(props) {
  const store = configureStore()
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Switch>
            <Route  path="/dashboard" component={() => <Main />} />
            <Route  exact path="/home" component={() => <LandingPage />} />
            <Redirect exact to="/home" /> 
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
