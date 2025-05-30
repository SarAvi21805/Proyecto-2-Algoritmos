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
    <AuthProvider> {/* Aqui se pasa el contexto a todas las paginas */}
      <Router> {/* Aqui se define la ruta principal */}
        <NavBar></NavBar> {/** La barra superior aparecerá en todas las vistas */}
        <Routes> {/* Aqui se definen las rutas del programa*/}
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
