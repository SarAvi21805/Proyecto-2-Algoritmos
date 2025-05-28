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
    const [checked, setChecked] = useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };
    return(
        <div style={{backgroundColor: "#fbf7d3" , maxWidth: 500, margin: "auto", padding:30 }}>
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
                {checked ? (
                <SignUp/>
                ):(
                <Login />
                )}
            </Paper>
        </div>
    );
}