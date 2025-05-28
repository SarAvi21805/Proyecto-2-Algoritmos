import React from "react";
import {Box, Container, Grid, Typography} from "@mui/material";
import CardInfo from "../../components/CardInfo";

type HomeProps = {
    title?: string; 
};

const Home: React.FC<HomeProps> = ({title = "Inicio"}) => {
    return( 
        <Box>
            <Container maxWidth='lg'>
                <Typography variant="h2" sx={{color: 'white', mt: 5, mb: 5}}>
                    {title}
                </Typography>
                <Grid container spacing={12} sx={{width:'100%', margin:0}} justifyContent='center'>
                    <Grid>
                        <CardInfo 
                            title="Misión" 
                            content="Nuestra misión es guiar a los estudiantes en su proceso de elección de carrera y universidad, proporcionando información clara, objetiva y actualizada sobre las opciones educativas disponibles, para que puedan tomar decisiones informadas que les permitan alcanzar sus metas académicas y profesionales."/>
                    </Grid>
                    <Grid>
                        <CardInfo 
                            title="Visión"
                            content="Ser la plataforma de referencia en recomendaciones universitarias en la región, reconocida por su compromiso con la excelencia, la transparencia y el apoyo a los estudiantes en su desarrollo educativo y personal."/>
                    </Grid>
                    <Grid>
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
                </Grid>
                <Typography variant="body2" sx={{color: 'black', mt: 5, mb: 5}} justifyContent='center'>
                    
                </Typography>
                <img 
                    src="https://sl.bing.net/deeM0q5lPYi"
                    alt="Descripción de la imagen" 
                    style={{ width: '100%', height: 'auto', marginBottom: '20px' }} // Estilos opcionales
                />
            </Container>
        </Box>
    )
}

export default Home;