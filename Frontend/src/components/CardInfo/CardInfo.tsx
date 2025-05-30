import React from "react";
import { Box, Paper } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

interface CardProps { //Propiedades que serán usadas en el componente
    title?: string;
    content?: string | string[];
}

const CardInfo: React.FC<CardProps> = ({title="Card", content="Contenido de la card"}) =>{ //Componente funcional que recibe las propiedades
    return (
        <Paper sx={{bgcolor:'#01045f', maxWidth: '100%', padding:1, borderRadius:5}} elevation={8}>
            <Card sx={{ minHeight:150, maxHeight:500}} >
                    <CardMedia/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component='div'>
                            {title}
                        </Typography>
                        {typeof content === 'string' ? (
                            <Typography variant="body1" sx={{color: 'text.secondary'}}>
                                {content}
                            </Typography>
                        ) : Array.isArray(content) ? (
                            content.map((item, index) => (
                                <Typography key={index} variant="body1" sx={{color: 'text.secondary'}}>
                                    {item}
                                </Typography>
                            ))
                        ) : null}
                    </CardContent>
            </Card>
        </Paper>
    );
}

export default CardInfo;