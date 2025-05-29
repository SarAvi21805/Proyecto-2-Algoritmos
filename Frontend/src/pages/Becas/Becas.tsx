import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, CircularProgress } from "@mui/material";
import api from "../../api/Api";

type Scholarship = {
  nombre: string;
  descripcion: string;
  masInformacion?: string;
};

const Becas: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      setError(null);
      try {
        const response = await api.get<Scholarship[]>("/becas");
        console.log("Scholarships response data:", response.data);
        setScholarships(response.data);
      } catch (err) {
        console.error("Error fetching scholarships data:", err);
        setError("Error fetching scholarships data.");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h3" gutterBottom>
          Becas
        </Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <Grid container spacing={3}>
            {scholarships.length === 0 ? (
              <Typography>No hay becas disponibles en este momento.</Typography>
            ) : (
              scholarships.map((beca, index) => (
                <Grid key={index} xs={12} sm={6} md={4} component="div">
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#01045f', color: 'white' }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>{beca.nombre}</Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{beca.descripcion}</Typography>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Becas;
