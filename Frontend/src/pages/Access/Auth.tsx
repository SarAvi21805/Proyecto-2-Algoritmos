import { useState } from "react";

//Material UI imports
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import LockIcon from '@mui/icons-material/Lock';
import Switch from '@mui/material/Switch';
import SignUp from "../../components/SingUp/SignupPage";
import Login from "../../components/Login/LoginPage";

export default function Auth(){
    const [checked, setChecked] = useState(true); // Estado default para el switch entre registrarse y login

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked); // Cambia el estado del switch
    };
    return(
        <div style={{maxWidth: 500, margin: "auto", padding:30 }}>
            <Paper elevation={3} style={{padding: "10px"}}>
                {checked ? (
                <Chip icon={<SentimentSatisfiedAltIcon />} label="Registrarse" color= "primary" variant="outlined"/>
                ):(
                <Chip icon={<LockIcon />} label="Iniciar Sesión" color= "primary" variant="outlined" />
                )}
            
                <Switch
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                <br />
                {checked ? ( // Si el switch está activado muestra el componente de registro
                <SignUp/>
                ):(
                <Login /> // Si el switch está desactivado muestra el componente de login
                )}
            </Paper>
        </div>
    );
}