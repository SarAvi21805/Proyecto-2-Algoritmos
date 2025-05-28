import React from "react";
import { Paper, Card, CardActionArea, CardMedia, CardContent, Typography, Button, Box, CardActions } from "@mui/material";

interface Props {
    carrera?: string;
    afinidad?: number | string;
    image?: string;
}

const CardInfo: React.FC<Props> = ({ carrera='Sin datos', afinidad= 'Sin datos', image='../../../public/Unicap.svg'}) =>{
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
                                <Button variant="contained" color="success" size="small">Detalles</Button>
                            </CardActions>
                        </CardContent>
                </Card>
            </Paper>
        </>
    )
}

export default CardInfo;