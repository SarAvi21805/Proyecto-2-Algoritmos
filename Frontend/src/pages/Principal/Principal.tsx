import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography} from '@mui/material';
import CardRecom from '../../components/CardRecom';
import api from '../../api/Api';

interface Recomendacion{
    carrera: string,
    promedio: number
}

const Principal = () => {
    const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);

    const getRecomendations = async (userName: string) =>{
    try {
            const response = await api.get(`/recomendation?correo=${userName}`);
            setRecomendaciones(response.data);
        } catch (error) {
            console.error(error)
            throw new Error('Error obteniendo recomendaciones');
        }
    }

    useEffect(()=>{
        getRecomendations('sergio123@gmail.com');
        console.log(recomendaciones)
    }, [])
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
                                    <CardRecom carrera={recomendacion.carrera} afinidad={Number(recomendacion.promedio.toFixed(2))}/>
                                </Grid>
                            ))
                        ):(
                            <Typography>
                                No hay recomendaciones
                            </Typography>
                        )
                    }
                </Grid>
            </Container>
        </Box>
    )
}

export default Principal;