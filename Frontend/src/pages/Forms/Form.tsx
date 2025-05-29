import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, Container, Typography, Paper, CircularProgress, Divider, Rating, Pagination, Button} from '@mui/material';
import type { Pregunta } from './Preguntas.ts';
import PreguntasData from '../../assets/Preguntas.json';
import { useAuth } from '../../context/AccesoContext.tsx';
import api from '../../api/Api.ts';
import axios from 'axios';

const PREGUNTASXPAG = 5;

const Form = () =>{
    const navigate = useNavigate();
    const {setAuthState} = useAuth();
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [pagActual, setPagActual] = useState(1);
    const [respuestas, setRespuestas] = useState<Record<number, number>>({});

    const indexUltimaPregunta = pagActual * PREGUNTASXPAG;
    const indexPrimeraPregunta = indexUltimaPregunta - PREGUNTASXPAG;
    const preguntasActuales = preguntas.slice(indexPrimeraPregunta, indexUltimaPregunta);
    const pagTotales = Math.ceil(preguntas.length/PREGUNTASXPAG);

    const cambioPuntuacion = (questionId: number, value: number | null) => {
        if (value !== null) {
            setRespuestas(prev => ({ ...prev, [questionId]: value }));
        }
    };

    const cambioPagina = (event: React.ChangeEvent<unknown>, page: number) => {
        setPagActual(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const enviarRespuestas = async () =>{
        const correo = localStorage.getItem('correo');
        if(!correo){
            throw new Error('No se encontró el usuario')
        }
        const respuestasFinal = preguntas.map((pregunta, index) =>({
            grupo: pregunta.grupo,
            rasgo: pregunta.caracteristica,
            peso: respuestas[index] || 0
        }));
        const filtroRespuestas = respuestasFinal.filter((pregunta) => pregunta.peso > 0);
        try {
            const response = await api.post(`/fillform?correo=${correo}`, filtroRespuestas, 
                {
                    headers: {'Content-Type': 'application/json'},
                }
            )
            if(response.status === 200){
                setAuthState('logged')
                setTimeout(() => {
                    navigate('/principal')
                }, 1000);
            }
            else{
                throw new Error('Error al enviar las respuestas');
            }
        } catch (error) {
            console.log(error)
            alert('Error al guardar las respuestas, intentelo nuevamente');
        }
    }

    useEffect(()=>{
        const timer = setTimeout(() => {
        setPreguntas(PreguntasData);
    }, 1000);
    return () => clearTimeout(timer);
    }, []);

    return (
        <Box>
            <Container maxWidth="lg">
                <Paper elevation={8} sx={{p: 3, mt:5, bgcolor:'#01045f'}}>
                    <Paper elevation={24} sx={{pb:4}}>
                        {preguntas.length === 0 ? 
                            (
                                <Box textAlign="center" py={8}>
                                    <CircularProgress size={60} />
                                    <Typography sx={{ mt: 2 }}>Cargando preguntas...</Typography>
                                </Box>
                            )
                            :(
                                <Box>
                                    <Typography variant="h2" sx={{color: 'black', pt:5, pl:5,  mt: 2}}>Formulario</Typography>
                                    <Typography variant="h5" sx={{color: 'black', paddingX: 10, mt: 2, mb: 1, textAlign:'center'}}>A continuación se le presentarán distintas preguntas que deberá contestar de acuerdo a lo identificado que se sienta con ellas.</Typography>
                                    <Typography variant="h6" sx={{color: 'black', paddingX: 10, mb: 5, textAlign:'center'}}>0 es el menor grado de identificación (Sin seleccionar nada), mientras que 10 es el mayor grado</Typography>
                                    {preguntasActuales.map((item, index) =>{
                                        return(
                                            <Box sx={{marginX:10, mb:5}}>
                                                <Divider variant='middle'/>
                                                <Typography key={index} variant='h6' sx={{mt:5}}> {indexPrimeraPregunta + index + 1}. {item.pregunta}</Typography>
                                                <Rating key={item.caracteristica} max={10} size='large' value={respuestas[indexPrimeraPregunta+index]||null} onChange={(_,value)=>{
                                                    cambioPuntuacion(indexPrimeraPregunta+index, value);
                                                }}/>
                                            </Box>
                                        )
                                    })}
                                    <Pagination count={pagTotales} page={pagActual} onChange={cambioPagina} size='large' sx={{}}/>
                                </Box>
                                
                            )
                        }
                        {pagActual === pagTotales &&(
                                <Box textAlign="center" mt={4}>
                                    <Button 
                                    variant="contained" 
                                    size="large" 
                                    sx={{ px: 6, py: 1.5 }}
                                    color='success'
                                    onClick={enviarRespuestas}
                                    >
                                    Enviar Respuestas
                                    </Button>
                                </Box>
                            )
                        }
                    </Paper>
                </Paper>
            </Container>
        </Box>
    )
}

export default Form;