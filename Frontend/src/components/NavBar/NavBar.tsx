import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Logo from '../../../public/Unicap.svg';
import {Button} from "@mui/material";
import { useAuth } from "../../context/AccesoContext";


const NavBar = () =>{
    const {authState, setAuthState} = useAuth(); // Obtiene el estado de autenticación
    const navigate = useNavigate(); // Obtiene la función para navegar entre rutas
    const cerrarSesion = () => { // Función para cerrar sesión
        setAuthState('home'); // Actualiza el estado de autenticación
        localStorage.clear();
        navigate('/') // Navega a la ruta principal
    }

    return(
        <Box sx={{flexGrow: 1}} >
            <AppBar position="static" sx={{minHeight:60, backgroundColor: "#01045f"}}>
                <Toolbar variant="dense">
                    <img src={Logo} style={{height:'75px', marginRight:'25px'}} onClick={()=>{navigate('/')}}/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={()=>{navigate('/')}}>
                        Brújula Universitaria
                    </Typography>
                    {authState === 'access' && ( // Si el usuario está en pagina de acceso no mostrar nada
                        <></>
                    )}
                    {authState === 'home' && ( // Si el usuario está en la pagina principal mostrar el boton de inicio de sesion
                        <Button variant='contained' color="success" component={Link} to='/access' onClick={()=>{setAuthState('access')}}>Acceder</Button>
                    )}
                    {authState === 'logged' && ( // Si el usuario está en la pagina de recomendaciones mostrar el boton de cerrar sesion y becas
                        <>
                            <Button variant="contained" color="error" onClick={()=>{cerrarSesion()}} sx={{mr:2}}>Cerrar Sesión</Button>
                            <Button color="inherit" component={Link} to="/becas" sx={{ border: '1px solid white' }}>
                                Becas
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;