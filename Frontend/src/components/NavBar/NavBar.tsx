import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Logo from '../../../public/Unicap.svg';
import {Button} from "@mui/material";
import { useAuth } from "../../context/AccesoContext";


const NavBar = () =>{
    const {authState, setAuthState} = useAuth();
    return(
        <Box sx={{flexGrow: 1}} >
            <AppBar position="static" sx={{minHeight:60, backgroundColor: "#01045f"}}>
                <Toolbar variant="dense">
                    <img src={Logo} style={{height:'75px', marginRight:'25px'}}/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Recomendaciones Universitarias
                    </Typography>
                    {authState === 'access' && (
                        <></>
                    )}
                    {authState === 'home' && (
                        <Button variant='contained' color="success" component={Link} to='/access' onClick={()=>{setAuthState('access')}}>Acceder</Button>
                    )}
                    {authState === 'logged' && (
                        <>
                            <Button variant="contained" color="error" component={Link} to='/' onClick={()=>{setAuthState('home')}} sx={{mr:2}}>Cerrar Sesión</Button>
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