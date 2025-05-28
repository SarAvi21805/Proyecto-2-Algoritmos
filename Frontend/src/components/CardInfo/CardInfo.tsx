import React from "react";
import { Box, Paper } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface CardProps {
    title?: string;
    content?: string;
}

const CardInfo: React.FC<CardProps> = ({title="Card", content="Contenido de la card"}) =>{
    return (
        <Paper sx={{bgcolor:'#01045f', padding:1, borderRadius:1}} elevation={8}>
            <Card sx={{maxWidth: 500, minWidth: 300, minHeight:150, maxHeight:500}} >
                <CardActionArea>
                    <CardMedia/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component='div'>
                            {title}
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary'}}>
                            {content}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Paper>
    );
}

export default CardInfo;