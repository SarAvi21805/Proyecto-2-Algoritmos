import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Logo from '../../../public/Unicap.svg';
import {Button} from "@mui/material";

const NavBar = () =>{
    const [isLog, setIsLog] = React.useState(false);
    return(
        <Box sx={{flexGrow: 1}} >
            <AppBar position="static" sx={{minHeight:60, backgroundColor: "#01045f"}}>
                <Toolbar variant="dense">
                    <img src={Logo} style={{height:'75px', marginRight:'25px'}}/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Recomendaciones Universitarias
                    </Typography>
                    {isLog ? (
                        <Button variant="contained" color="error" component={Link} to='/' onClick={()=>{setIsLog(false)}}>Cerrar Sesión</Button>
                    ):(
                        <Button variant='contained' color="success" component={Link} to='/principal' onClick={()=>{setIsLog(true)}}>Acceder</Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;