import React from "react";
import {Box, Container, Grid, Typography} from "@mui/material";
import CardInfo from "../../components/CardInfo";

type HomeProps = {
    title?: string; 
};

const Home: React.FC<HomeProps> = ({title = "Inicio"}) => {
    return( 
        <Box>
            <Container maxWidth='lg'>
                <Typography variant="h2" sx={{color: 'white', mt: 5, mb: 5}}>
                    {title}
                </Typography>
                <Grid container spacing={12} sx={{width:'100%', margin:0}} justifyContent='center'>
                    <Grid>
                        <CardInfo title="Hola mundo" content="Esta es una prueba"/>
                    </Grid>
                    <Grid>
                        <CardInfo/>
                    </Grid>
                    <Grid>
                        <CardInfo/>
                    </Grid>
                </Grid>
                <Typography variant="body2" sx={{color: 'black', mt: 5, mb: 5}} justifyContent='center'>
                    {title}
                </Typography>
            </Container>
        </Box>
    )
}

export default Home;