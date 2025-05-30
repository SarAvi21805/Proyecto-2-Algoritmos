import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, Container, Typography, Paper, CircularProgress, Divider, Rating, Pagination, Button} from '@mui/material';
import type { Pregunta } from './Preguntas.ts';
import PreguntasData from '../../assets/Preguntas.json';
import { useAuth } from '../../context/AccesoContext.tsx';
import api from '../../api/Api.ts';

const PREGUNTASXPAG = 5;
const labels: { [index: string]: string } = { // Mensaje asociado a las puntuaciones del rating
  0.5: 'Nada identificado',
  1: 'Mínimamente identificado',
  1.5: 'Poco identificado',
  2: 'Algo identificado',
  2.5: 'Medianamente identificado', 
  3: 'Identificado',
  3.5: 'Bastante identificado',
  4: 'Muy identificado',
  4.5: 'Extremadamente identificado',
  5: 'Totalmente identificado'
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}


const Form = () =>{
    const navigate = useNavigate();
    const {setAuthState} = useAuth();
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]); // Array de preguntas 
    const [pagActual, setPagActual] = useState(1); // Pagina actual
    const [respuestas, setRespuestas] = useState<Record<number, number>>({}); // Objeto con las respuestas
    const [hoverStates, setHoverStates] = useState<Record<number, number>>({}); // Objeto con los estados de hover de las estrellas
    const [valueStates, setValueStates] = useState<Record<number, number | null>>({}); // Objeto con los estados de valor de las estrellas

    const indexUltimaPregunta = pagActual * PREGUNTASXPAG; // Index de la ultima pregunta de la pagina actual
    const indexPrimeraPregunta = indexUltimaPregunta - PREGUNTASXPAG; // Index de la primera pregunta de la pagina actual
    const preguntasActuales = preguntas.slice(indexPrimeraPregunta, indexUltimaPregunta); // Preguntas de la pagina actual
    const pagTotales = Math.ceil(preguntas.length/PREGUNTASXPAG); // Paginas totales

    const cambioPuntuacion = (questionId: number, value: number | null) => {
        if (value !== null) {
            setRespuestas(prev => ({ ...prev, [questionId]: value*2 })); // Guardar la puntuacion en el objeto de respuestas
        }
    };

    const handleRatingChange = (questionId: number, newValue: number | null) => {
        setValueStates(prev => ({ ...prev, [questionId]: newValue }));
        cambioPuntuacion(questionId, newValue); // Guardar la puntuacion en el objeto de respuestas
    };

    const handleHoverChange = (questionId: number, newHover: number) => {
        setHoverStates(prev => ({ ...prev, [questionId]: newHover }));
    };

    const cambioPagina = (event: React.ChangeEvent<unknown>, page: number) => {
        setPagActual(page); // Cambiar la pagina actual
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Ir a la parte superior de la pagina
    };

    const enviarRespuestas = async () =>{ // Funcion para enviar las respuestas
        const correo = localStorage.getItem('correo'); // Obtener el correo del usuario
        if(!correo){
            throw new Error('No se encontró el usuario') // Si no se encuentra el correo, lanzar error
        }
        const respuestasFinal = preguntas.map((pregunta, index) =>({ // Crear un objeto con las respuestas
            grupo: pregunta.grupo,
            rasgo: pregunta.caracteristica,
            peso: respuestas[index] || 0
        }));
        const filtroRespuestas = respuestasFinal.filter((pregunta) => pregunta.peso > 0); // Filtro para eliminar las respuestas con valor 0
        try {
            const response = await api.post(`/fillform?correo=${correo}`, filtroRespuestas,  // Enviar las respuestas
                {
                    headers: {'Content-Type': 'application/json'},
                }
            )
            if(response.status === 200){
                setAuthState('logged') // Cambiar el estado de autenticacion a logged
                setTimeout(() => {
                    navigate('/principal') // Redireccionar a la pagina principal
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

    useEffect(()=>{ // Cuando se carga la pagina traer preguntas del archivo json
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
                        {preguntas.length === 0 ?   // Si no hay preguntas mostrar un componente de carga
                            (
                                <Box textAlign="center" py={8}>
                                    <CircularProgress size={60} />
                                    <Typography sx={{ mt: 2 }}>Cargando preguntas...</Typography>
                                </Box>
                            )
                            :( // Si hay preguntas mostrar el formulario
                                <Box>
                                    <Typography variant="h2" sx={{color: 'black', pt:5, pl:5,  mt: 2}}>Formulario</Typography>
                                    <Typography variant="h5" sx={{color: 'black', paddingX: 10, mt: 2, mb: 1, textAlign:'center'}}>A continuación se le presentarán distintas preguntas que deberá contestar de acuerdo a lo identificado que se sienta con ellas.</Typography>
                                    <Typography variant="h6" sx={{color: 'black', paddingX: 10, mb: 5, textAlign:'center'}}>0 es el menor grado de identificación (Sin seleccionar nada), mientras que 5 es el mayor grado</Typography>
                                    {preguntasActuales.map((item, index) =>{ // Mapear las preguntas
                                        return(
                                            <Box sx={{marginX:10, mb:5}}>
                                                <Divider variant='middle'/>
                                                <Typography key={index} variant='h6' sx={{mt:5}}> {indexPrimeraPregunta + index + 1}. {item.pregunta}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
                                                    <Box sx={{ width: 250, display: 'flex', alignItems: 'center' }}>
                                                        <Rating key={item.caracteristica} max={5} precision={0.5} size='large' value={(respuestas[indexPrimeraPregunta+index])/2} getLabelText={getLabelText} sx={{'& .MuiRating-icon': {fontSize: '2.5rem',}}} onChange={(_,value)=>{
                                                            handleRatingChange(indexPrimeraPregunta+index, (value));
                                                        }} 
                                                        onChangeActive={(event, newHover) => {handleHoverChange(indexPrimeraPregunta+index, newHover)}}/>
                                                            {valueStates[indexPrimeraPregunta+index] !== null && (
                                                                    <Box sx={{ ml: 2 }}>
                                                                        <Typography variant='body2'>
                                                                            {labels[
                                                                                hoverStates[indexPrimeraPregunta+index] !== undefined 
                                                                                ? hoverStates[indexPrimeraPregunta+index] 
                                                                                : (valueStates[indexPrimeraPregunta+index] || 0)
                                                                            ]}
                                                                        </Typography>
                                                                    </Box>
                                                            )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                    <Pagination count={pagTotales} page={pagActual} onChange={cambioPagina} size='large' sx={{}}/>
                                </Box>
                                
                            )
                        }
                        {pagActual === pagTotales &&( // Si se ha llegado al final de las preguntas mostrar un boton para enviar el formulario
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