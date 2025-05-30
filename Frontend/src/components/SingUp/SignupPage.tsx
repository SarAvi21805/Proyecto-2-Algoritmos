import { useState, type ChangeEvent } from "react";
import {useNavigate} from "react-router-dom"

// Material UI Imports
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
import axios from "axios";
import api from "../../api/Api";

//Validacion de correo
const isEmail = (email: string): boolean =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Inputs
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  // Input Error
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  // Validacion y resultados
  const [formValid, setFormValid] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClickShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  // manejo de validaciones
  const handleUsername = (): void => {
    if (!usernameInput || usernameInput.length < 5 || usernameInput.length > 15) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handleEmail = (): void => {
    if (!isEmail(emailInput)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handlePassword = (): void => {
    if (!passwordInput || passwordInput.length < 5 || passwordInput.length > 20) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleSubmit = async () => {
    setSuccess(null);

    if (usernameError || !usernameInput) { // si el campo de usuario esta vacio o no cumple con la validacion
      setFormValid("Nombre de usuario debe ser entre 5 - 15 caracteres.");
      return;
    }

    if (emailError || !emailInput) { // si el campo de correo esta vacio o no cumple con la validacion
      setFormValid("Dirección de correo invalida.");
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid("Contraseña debe tener entre 5 - 20 caracteres.");
      return;
    }

        try {
      const response = await api.post('/register', { // envio de datos al servidor para registrar usuario
        correo: emailInput,
        contrasena: passwordInput,
        nombre: usernameInput
      },{
        headers: {
          'Content-Type': 'application/json', // tipo de datos que se envian
        }
      })
      if(response.status === 200){
        localStorage.setItem('correo', emailInput) // guardo el correo en el local storage
        setFormValid(null);
        setSuccess('Cuenta creada correctamente!')
        setTimeout(() => {
          navigate('/form'); // redirecciono a la pagina de formulario
        }, 1000);
      }
    } catch (error) {
        console.log(error)
        if(axios.isAxiosError(error)){
          const errorMessage = error.response?.data?.message || "Error al iniciar sesión"; // si el error es de axios muestra el error obtenido
          setFormValid(errorMessage);
        }else{
          setFormValid('Error desconocido al iniciar sesión'); // si el error no es de axios muestra un mensaje de error desconocido
        }
    }
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <TextField
          error={usernameError}
          label="Usuario"
          id="standard-basic"
          variant="standard"
          sx={{ width: "100%" }}
          size="small"
          value={usernameInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsernameInput(e.target.value)}
          onBlur={handleUsername}
        />
      </div>

      <div style={{ marginTop: "5px" }}>
        <TextField
          error={emailError}
          label="Correo"
          id="standard-basic"
          variant="standard"
          sx={{ width: "100%" }}
          size="small"
          fullWidth
          value={emailInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)}
          onBlur={handleEmail}
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
          <Alert severity="error">{formValid}</Alert>
        </Stack>
      )}

      {success && (
        <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
          <Alert severity="success">{success}</Alert>
        </Stack>
      )}
    </div>
  );
}
