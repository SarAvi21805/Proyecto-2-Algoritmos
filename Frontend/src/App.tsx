import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Principal from './pages/Principal';
import Form from './pages/Forms';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home title='Página de inicio'/>}/>
        <Route path='/principal' element={<Principal/>}/>
        <Route path='/form' element={<Form/>}/>
      </Routes>
    </Router>
  )
}

export default App
