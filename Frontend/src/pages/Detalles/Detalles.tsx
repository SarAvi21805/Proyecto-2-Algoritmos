import { Box, Card, CardContent, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';


export default function Detalles() {
  return (
    <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={5}>
            <Paper elevation={6} sx={{p: 4,backgroundColor: '#01045f', borderRadius: 2,display: 'inline-block'}}>
                <Typography gutterBottom sx={{ color: 'white', fontSize: 35, mb: 4 }}>
                Carrera
                </Typography>
                <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ minHeight: 200 }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 25 }}>
                        Descripción de la carrera 
                        </Typography>
                        <Typography variant="body2">info</Typography>
                    </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ minHeight: 200 }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 25 }}>
                        Universidades en las que se imparte
                        </Typography>
                        <Typography variant="body2">info</Typography>
                    </CardContent>
                    </Card>
                </Grid>
                </Grid>
            </Paper>
        </Box>
    </Container>
  );
}
