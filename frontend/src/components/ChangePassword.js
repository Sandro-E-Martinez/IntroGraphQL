import React, {useState} from 'react'
import Div100vh from 'react-div-100vh';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, gql } from '@apollo/client';

import Loading from './Loading';
import Modal from './Modal';

// PREPARAMOS LA CONSULTA PARA OBTEBER LOS DATOS DEL USUARIO

// PREPARAMOS LA MUTACIÓN PARA PARA CAMBIAR EL PASSWORD

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    rowGap: 24,
    margin: '32px 12px 32px 12px'
  },
  link: {
    cursor: 'pointer'
  }
}));

const ChangePassword = ({onLogout}) => {
  const { control, handleSubmit } = useForm();
  const [message, setMessage] = useState(null);

  // REALIZAMOS LA CONSULTA DE LOS DATOS DEL USUARIO ACTUAL

  // PREPARAMOS LA MUTACIÓN PARA ACTUALIZAR LOS DATOS DEL USUARIO

  const onSubmit = async ({password}) => {
    console.log('forma data', password);

    // UTILIZAMOS NUESTRO MÉTODO PARA CAMBIAR PASSWORD
  }

  const classes = useStyles();

    return (
      <Div100vh className={classes.root}>
        <Container maxWidth='sm' className={classes.container}>
          {/* Mostramos el nombre del usuario */}
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Typography variant="h5">Cambia tu password</Typography>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => <TextField {...field}
                placeholder="Escribe tu nuevo password"
                variant="outlined"
              />}
            />
            <Button variant="contained" type="submit">Cambiar</Button>
            </form>
            <Link onClick={onLogout} className={classes.link}>
              Cerrar Sesión
            </Link>
            {
              message && <Modal title="Cambio Exitoso" message={message} />
            }
        </Container>
      </Div100vh>
    )
}

export default ChangePassword
