import { Box, Button, Card, CardContent, CircularProgress, Container, Divider, IconButton, Link, Paper, Typography } from '@mui/material';
import {Grid} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/Api';
import { useEffect, useState } from 'react';
import { ArrowBack } from '@mui/icons-material';

interface Detalles{ // interface para definir la estructura de los datos
    Carrera: string,
    Descripción: string,
    Pensum: string[],
    NombresEspecificos: string[],
    Duraciones: string[],
    Universidades: string[]
}

export default function Detalles() {
    const {nombreCarrera} = useParams<{nombreCarrera: string}>(); // obtener el nombre de la carrera
    const [carrera, setCarrera] = useState<Detalles>(); // estado para almacenar la carrera
    const [loading, setLoading] = useState(true); // estado para mostrar el cargando
    const navigate = useNavigate();
    

    const getDetalles = async () =>{
        try {
            const response = await api.get(`/carrera?nombre=${nombreCarrera}`); // obtener la carrera
            const data = { // convertir la respuesta a un objeto
                Carrera: response.data.Carrera,
                Descripción: response.data.Descripción,
                Pensum: response.data.Pensum,
                NombresEspecificos: response.data.NombresEspecificos,
                Duraciones: response.data.Duraciones,
                Universidades: response.data.Universidades
            };
            setCarrera(data); // actualizar el estado
        } catch (error) {
            console.log(error)
            throw new Error('Error obteniendo los detalles')
            
        }
    }

    useEffect(()=>{
        if(!nombreCarrera){
            setLoading(false); // si no hay carrera, no mostrar el cargando
        }
        if(nombreCarrera){
            getDetalles(); // obtener la carrera
            setLoading(false); 
        }
    }, [nombreCarrera]); // ejecutar la función cuando cambie el nombre de la carrera

  return (
    <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={5}>
            <Paper elevation={6} sx={{p: 4,backgroundColor: '#01045f', borderRadius: 2,display: 'inline-block', mb:5}}>
                {
                    loading ? ( // si está cargando, mostrar un mensaje
                        <Box textAlign="center" py={8}>
                            <CircularProgress size={60} />
                            <Typography sx={{ mt: 2 }}>Cargando recomendaciones...</Typography>
                        </Box>
                    ):( // si no está cargando, mostrar los detalles de la carrera
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
                                            carrera?.Pensum.map((pensum, index) =>( // mostrar los pensum, duraciones y universidades donde se imparte la carrera
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
                <Button variant='contained' startIcon={<ArrowBack/>} color='error' size='large' sx={{mb:2, mt:5}} onClick={()=>{navigate(-1)}}>
                    Regresar
                </Button>
            </Paper>
        </Box>
    </Container>
  );
}
