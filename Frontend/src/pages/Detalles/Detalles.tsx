import { Box, Card, CardContent, CircularProgress, Container, Divider, Link, Paper, Typography } from '@mui/material';
import {Grid} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../../api/Api';
import { useEffect, useState } from 'react';

interface Detalles{
    Carrera: string,
    Descripción: string,
    Pensum: string[],
    NombresEspecificos: string[],
    Duraciones: string[],
    Universidades: string[]
}

export default function Detalles() {
    const {nombreCarrera} = useParams<{nombreCarrera: string}>();
    const [carrera, setCarrera] = useState<Detalles>();
    const [loading, setLoading] = useState(true);
    

    const getDetalles = async () =>{
        try {
            const response = await api.get(`/carrera?nombre=${nombreCarrera}`);
            const data = {
                Carrera: response.data.Carrera,
                Descripción: response.data.Descripción,
                Pensum: response.data.Pensum,
                NombresEspecificos: response.data.NombresEspecificos,
                Duraciones: response.data.Duraciones,
                Universidades: response.data.Universidades
            };
            setCarrera(data);
        } catch (error) {
            console.log(error)
            throw new Error('Error obteniendo los detalles')
            
        }
    }

    useEffect(()=>{
        if(!nombreCarrera){
            setLoading(false);
        }
        if(nombreCarrera){
            getDetalles();
            setLoading(false);
        }
    }, [nombreCarrera]);

  return (
    <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={5}>
            <Paper elevation={6} sx={{p: 4,backgroundColor: '#01045f', borderRadius: 2,display: 'inline-block'}}>
                {
                    loading ? (
                        <Box textAlign="center" py={8}>
                            <CircularProgress size={60} />
                            <Typography sx={{ mt: 2 }}>Cargando recomendaciones...</Typography>
                        </Box>
                    ):(
                        <>
                            <Typography gutterBottom sx={{ color: 'white', fontSize: 35, mb: 4 }}>
                            {carrera?.Carrera}
                            </Typography>
                            <Grid container spacing={5}>
                                <Grid>
                                    <Card sx={{ minHeight: 200 }}>
                                    <CardContent>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 25 }}>
                                        Descripción de la carrera 
                                        </Typography>
                                        <Typography variant="body2">{carrera?.Descripción}</Typography>
                                    </CardContent>
                                    </Card>
                                </Grid>
                                <Grid>
                                    <Card sx={{ minHeight: 200 }}>
                                    <CardContent>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 25 }}>
                                        Universidades en las que se imparte
                                        </Typography>
                                        {
                                            carrera?.Pensum.map((pensum, index) =>(
                                                <>
                                                    <Divider variant='middle'/>
                                                    <Typography variant="body2">Es impartida en la {carrera.Universidades[index]}, se le conoce como {carrera.NombresEspecificos[index]} </Typography>
                                                    <Typography variant='body2'>Enlace oficial al pensum: <Link href={pensum} variant='body2'>{pensum}</Link> </Typography>
                                                </>
                                            ))
                                        }
                                    </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </>
                    )
                }
            </Paper>
        </Box>
    </Container>
  );
}
