import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, CircularProgress, Button } from "@mui/material";
import api from "../../api/Api";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type Scholarship = {
  Nombre: string;
  Descripcion: string;
  MasInformacion?: string;
};

const Becas: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]); // Listado de becas
  const [loading, setLoading] = useState<boolean>(true); // Variable para mostrar el loading, inicialmente es true
  const [error, setError] = useState<string | null>(null); // Variable para mostrar el error, inicialmente es null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScholarships = async () => {
      setError(null);
      try {
        const response = await api.get<Scholarship[]>("/becas"); // Llamada a la API para obtener las becas
        console.log("Scholarships response data:", response.data); // Imprime en la consola los datos de la respuesta
        setScholarships(response.data); // Actualiza el estado con los datos de la respuesta
      } catch (err) {
        console.error("Error fetching scholarships data:", err);
        setError("Error fetching scholarships data.");
      } finally {
        setLoading(false); // Una vez que se ha realizado la llamada a la API, se establece la variable loading
      }
    };

    fetchScholarships(); // Llamada a la función que realiza la llamada a la API
  }, []);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h3" gutterBottom>
          Becas
        </Typography>
        {loading && <CircularProgress />} // Si la variable loading es true, se muestra el loading
        {error && <Typography color="error">{error}</Typography>} // Si la variable error es distinto de null, se muestra el error
        {!loading && !error && (
          <Grid container spacing={3}>
            {scholarships.length === 0 ? ( // Si no hay becas, se muestra un mensaje
              <Typography>No hay becas disponibles en este momento.</Typography>
            ) : (
              scholarships.map((beca, index) => ( // Se itera sobre el listado de becas y se crea una serie de componentes para cada una con su información
                <Grid key={index}component="div">
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#01045f', color: 'white' }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>{beca.Nombre}</Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{beca.Descripcion}</Typography>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        )}
        <Button variant='contained' startIcon={<ArrowBack/>} color='error' size='large' sx={{mb:2, mt:5}} onClick={()=>{navigate(-1)}}> {/*Botón para regresar a la página anterior */}
            Regresar
        </Button>
      </Container>
    </Box>
  );
};

export default Becas;
