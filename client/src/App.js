import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter , Route , Link} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import Registerscreen from './screens/Registerscreem';
import Loginscreen from './screens/Loginscreen';
import Bookingscreen from './screens/Bookingscreen';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
import Landingscreen from './screens/Landingscreen';


function App() {
  return (
    <div className="App">
     <Navbar/>
     <BrowserRouter>
     <Route path="/" exact component={Landingscreen}/>
     <Route path="/home" exact component={Homescreen}/>
     <Route path='/book/:roomid/:fromdate/:todate' exact component={Bookingscreen}/>
     <Route path="/register" exact component={Registerscreen}/>
     <Route path="/login" exact component={Loginscreen}/>
     <Route path="/profile" exact component={Profilescreen }/>
     <Route path="/admin" exact component={Adminscreen }/>

     </BrowserRouter>
    </div>
  );
}

export default App;
