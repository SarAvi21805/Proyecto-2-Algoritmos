import React, { useEffect } from "react";
import {Box, Container, Grid, Paper, Typography} from "@mui/material";
import CardInfo from "../../components/CardInfo";
import { useAuth } from "../../context/AccesoContext";

type HomeProps = {
    title?: string; 
};

const Home: React.FC<HomeProps> = ({title = "Inicio"}) => {
    const {setAuthState} = useAuth(); // Obtiene el estado de autenticación
    useEffect(()=>{
        setAuthState('home') // Establece el estado de autenticación
    },[])

    return( 
        <Box sx={{marginX: 50}}>
            <Typography variant="h3" sx={{color: 'white', mt: 5, mb: 5, fontFamily:'Playball'}} align='center'>
                {title}
            </Typography>
            <Grid container spacing={2} justifyContent='center'>
                <Grid size={8}>
                    <CardInfo 
                        title="Misión" 
                        content="Nuestra misión es guiar a los estudiantes en su proceso de elección de carrera y universidad, proporcionando información clara, objetiva y actualizada sobre las opciones educativas disponibles, para que puedan tomar decisiones informadas que les permitan alcanzar sus metas académicas y profesionales."/>
                </Grid>
                <Grid size={4}>
                    <CardInfo 
                        title="Visión"
                        content="Ser la plataforma de referencia en recomendaciones universitarias en la región, reconocida por su compromiso con la excelencia, la transparencia y el apoyo a los estudiantes en su desarrollo educativo y personal."/>
                </Grid>
                <Grid size={4}>
                    <CardInfo
                        title="Objetivos"
                        content={[
                            "1. Informar: Proporcionar información detallada sobre programas académicos, requisitos de admisión y oportunidades de financiamiento en diversas universidades.", 
                            "2. Orientar: Ofrecer asesoría personalizada a los estudiantes para ayudarles a identificar sus intereses y habilidades, y así elegir la carrera adecuada.",
                            "3. Conectar: Facilitar el contacto entre estudiantes y universidades, promoviendo ferias educativas y eventos de orientación.",
                            "4. Actualizar: Mantener una base de datos actualizada sobre las tendencias educativas y cambios en el sistema universitario."
                        ]}
                    />
                </Grid>
                <Grid size={6.5}>
                    <Paper sx={{bgcolor:'#01045f', maxWidth: '100%', padding:1, borderRadius:5}} elevation={8}>
                        <img 
                            src="/Estudiantes.jpg" //Ruta relativa
                            style={{ 
                                maxWidth: '100%',
                                borderRadius: '50px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                opacity: 100}}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Home;