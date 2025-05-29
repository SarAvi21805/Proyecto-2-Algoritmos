import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Principal from './pages/Principal';
import Form from './pages/Forms';
import NavBar from './components/NavBar';
import Auth from './pages/Access'
import Detalles from './pages/Detalles';
import Becas from './pages/Becas/Becas';
import { AuthProvider } from './context/AccesoContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Home title='"El futuro pertenece a aquellos que creen en la belleza de sus sueños." - Eleanor Roosevelt'/>}/>
          <Route path='/principal' element={<Principal/>}/>
          <Route path='/form' element={<Form/>}/>
          <Route path='/access' element={<Auth/>}/>
          <Route path='/detalle/:nombreCarrera' element={<Detalles/>}/>
          <Route path='/becas' element={<Becas/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
