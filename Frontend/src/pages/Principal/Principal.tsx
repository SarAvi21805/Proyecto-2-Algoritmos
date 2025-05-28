import React from 'react';
import { Box, Container, Grid, Typography} from '@mui/material';
import CardRecom from '../../components/CardRecom';

const Principal = () => {
    return (
        <Box>
            <Container maxWidth='lg'>
                <Typography variant='h2' sx={{color: 'black', mt:5, mb:5}}>
                    Nuestras Recomendaciones
                </Typography>
                <Grid container spacing={12} sx={{width:'100%', margin:0, mb:10}} justifyContent='center'>
                    <Grid>
                        <CardRecom></CardRecom>
                    </Grid>
                    <Grid>
                        <CardRecom></CardRecom>
                    </Grid>
                    <Grid>
                        <CardRecom></CardRecom>
                    </Grid>
                    <Grid>
                        <CardRecom></CardRecom>
                    </Grid>
                    <Grid>
                        <CardRecom></CardRecom>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Principal;