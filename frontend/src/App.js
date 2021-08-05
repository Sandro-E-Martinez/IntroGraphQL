import {useState} from 'react';

import Login from './components/Login'
import ChangePassword from './components/ChangePassword'

const App = () => {
const [token, setToken] = useState(null);

const onAuthHandler = (token) => {
  localStorage.setItem('token', token);
  setToken(token);
};

const onLogoutHandler = () => {
  localStorage.setItem('token', null);
  setToken(null);
}

  return ( token !== null
    ? (<ChangePassword onLogout={onLogoutHandler} />)
    : (<Login onAuth={onAuthHandler}/>));
}

export default App;
