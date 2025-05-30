import { useState, type ChangeEvent, type MouseEvent } from "react";
import {useNavigate} from "react-router-dom"
import { useAuth } from "../../context/AccesoContext";
import api from "../../api/Api";
import axios from "axios";

// Material UI imports
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Alert,
  Stack,
} from "@mui/material";

// Material UI Icon Imports
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

// Validacion de correo
const isEmail = (email: string): boolean =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function Login() {
  const navigate = useNavigate();
  const {setAuthState} = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Inputs
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  // Input Error
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  // Form feedback
  const [formValid, setFormValid] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleEmail = () => {
    if (!isEmail(emailInput)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
  };

  const handlePassword = () => {
    if (
      !passwordInput ||
      passwordInput.length < 5 ||
      passwordInput.length > 20
    ) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  const handleSubmit = async () => { // función para enviar el formulario
    setSuccess(null);

    if (emailError || !emailInput) { // si el email no es válido o está vacío
      setFormValid("Correo invalido");
      return;
    }

    if (passwordError || !passwordInput) { // si la contraseña no es válida o está vacía
      setFormValid(
        "Contraseña invalida. "
      );
      return;
    }

    setFormValid(null);

    try {
      const response = await api.post('/login', { //Hacer llamada a la api enviando los datos de correo y contraseña
        correo: emailInput,
        contrasena: passwordInput
      },{
        headers: { 
          'Content-Type': 'application/json', // Indicar que el contenido es json
        }
      })
      if(response.status === 200){ // si la respuesta es exitosa
        localStorage.setItem('correo', response.data.usuario.correo) // guardar el correo en el local storage
        setSuccess('Inicio de sesión existoso!') // mostrar mensaje de inicio de sesión exitoso
        setAuthState('logged'); // cambiar el estado de autenticación a true
        setTimeout(() => {
          navigate('/principal'); // redireccionar a la página principal
        }, 1000);
      }
    } catch (error) {
        if(axios.isAxiosError(error)){
          const errorMessage = error.response?.data?.message || "Error al iniciar sesión"; // obtener el mensaje de error
          setFormValid(errorMessage);
        }else{
          setFormValid('Error desconocido al iniciar sesión');
        }
    }
  };

  return (
    <div>
      <div style={{ marginTop: "5px" }}>
        <TextField
          label="Correo"
          fullWidth
          error={emailError}
          id="standard-basic"
          variant="standard"
          sx={{ width: "100%" }}
          value={emailInput}
          onBlur={handleEmail}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setEmailInput(event.target.value);
          }}
          size="small"
        />
      </div>

      <div style={{ marginTop: "5px" }}>
        <FormControl sx={{ width: "100%" }} variant="standard">
          <InputLabel
            error={passwordError}
            htmlFor="standard-adornment-password"
          >
            Contraseña
          </InputLabel>
          <Input
            error={passwordError}
            onBlur={handlePassword}
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            value={passwordInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setPasswordInput(event.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>

      <div style={{ marginTop: "10px" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={handleSubmit}
        >
          Iniciar Sesión
        </Button>
      </div>

      {formValid && (
        <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
          <Alert severity="error">
            {formValid}
          </Alert>
        </Stack>
      )}

      {success && (
        <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
          <Alert severity="success">
            {success}
          </Alert>
        </Stack>
      )}
    </div>
  );
}
