import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Principal from './pages/Principal';
import Form from './pages/Forms';
import NavBar from './components/NavBar';
import Auth from './pages/Access'
import { AuthProvider } from './context/AccesoContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Home title='Página de inicio'/>}/>
          <Route path='/principal' element={<Principal/>}/>
          <Route path='/form' element={<Form/>}/>
          <Route path='/access' element={<Auth/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
