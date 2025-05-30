import React from "react";
import { Paper, Card, CardActionArea, CardMedia, CardContent, Typography, Button, Box, CardActions } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props { //Propiedades del componente
    carrera?: string;
    afinidad?: number | string;
    image?: string;
}

const CardInfo: React.FC<Props> = ({ carrera='Sin datos', afinidad= 'Sin datos', image='../../../public/Unicap.svg'}) =>{ //Componente funcional con datos default en caso de no recibirlos
    const navigate = useNavigate();
    return (
        <>
            <Paper sx={{bgcolor:'#01045f', padding:1, borderRadius:1}} elevation={24}>
                <Card sx={{maxWidth: 500, minWidth: 300, minHeight:150, maxHeight:500}} >
                    <CardActionArea>
                        <CardMedia component='img' image={image} height="200"/>
                    </CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component='div'>
                            {carrera}
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary'}}>
                            Afinidad: {afinidad}%
                        </Typography>
                        <CardActions sx={{display:'flex', justifyContent:'flex-end'}}>
                            <Button variant="contained" color="success" size="small" onClick={()=>{navigate(`/detalle/${carrera}`)}}>Detalles</Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </Paper>
        </>
    )
}

export default CardInfo;