import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container, Grid, Typography} from '@mui/material';
import CardRecom from '../../components/CardRecom';
import api from '../../api/Api';

interface Recomendacion{
    carrera: string,
    promedio: number
}

const Principal = () => {
    const rutaImagenes = '../../../public/';
    const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getRecomendations = async (userName: string) =>{
        try {
            const response = await api.get(`/recomendation?correo=${userName}`);
            setRecomendaciones(response.data);
        } catch (error) {
            console.error(error)
            throw new Error('Error obteniendo recomendaciones');
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        // Obtener el correo del localStorage
        const userEmail = localStorage.getItem('correo');
        
        if (!userEmail) {
            setError('No se encontró el correo del usuario');
            setLoading(false);
            return;
        }

        // Usar el correo obtenido del localStorage
        getRecomendations(userEmail);
    }, []);

    if (loading) {
        return (
            <Box textAlign="center" py={8}>
                <CircularProgress size={60} />
                <Typography sx={{ mt: 2 }}>Cargando recomendaciones...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Box>
            <Container maxWidth='lg'>
                <Typography variant='h2' sx={{color: 'white', mt:5, mb:5}}>
                    Nuestras Recomendaciones
                </Typography>
                <Grid container spacing={12} sx={{width:'100%', margin:0, mb:10}} justifyContent='center'>
                    {
                        recomendaciones.length > 0 ? (
                            recomendaciones.map((recomendacion) => (
                                <Grid>
                                    <CardRecom carrera={recomendacion.carrera} afinidad={Number(recomendacion.promedio.toFixed(2))} image={rutaImagenes+ recomendacion.carrera + '.jpg'}/>
                                </Grid>
                            ))
                        ):(
                            <Box textAlign="center" py={8}>
                                <CircularProgress size={60} />
                                <Typography sx={{ mt: 2 }}>Cargando preguntas...</Typography>
                            </Box>
                        )
                    }
                </Grid>
            </Container>
        </Box>
    )
}

export default Principal;