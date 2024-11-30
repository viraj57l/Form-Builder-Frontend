import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import ViewForm from './pages/View';
import CreateForm from './pages/CreateForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/form/:id' element={<ViewForm/>}/>
        <Route path='/form/create-form' element={<CreateForm/>}/>
        <Route path='/form/edit/:id' element={<CreateForm/>}/>
      </Routes>
    </Router>
       
 
  );
}

export default App;
