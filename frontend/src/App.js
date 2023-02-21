
import './App.css';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Home from './screens/home';
import ChatScreen from './screens/chat';
function App() {
  return (
    <div className="App">
      {/* Routing paths */}
      <Route path = '/' component = {Home} exact/> 
      <Route path = '/chat/' component = {ChatScreen}/>
      </div>
  );
}

export default App;
