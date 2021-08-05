import React from 'react';
import Div100vh from 'react-div-100vh';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useForm, Controller } from "react-hook-form";
import { useMutation, gql } from '@apollo/client';

import Loading from './Loading';
import Modal from './Modal';

//DECLARAMOS EL MUTATUION PARA AUTENTICAR

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  container: {
    textAlign: 'center',
  },
  card: {
    height: '100%',
  },
  header: {
    background: theme.palette.primary.main,
  },
  form: {
    display: 'grid',
    rowGap: 24,
    margin: '0 12px 6px 12px'
  }
}));


const Login = ({onAuth}) => {
  const classes = useStyles();
  const { control, handleSubmit } = useForm();

  // PREPARAMOS LA LLAMADA DE LA MUTACION

  const onSubmit = async (formData) => {
    console.log('Datos del formulario',formData);
    // UTILIZAMOS LA MUTACIÓN "AUTH" EN EL SUBMIT DEL FORMULARIO
  }

  return (
    <Div100vh className={classes.root}>
      <Container maxWidth='xs' className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Typography variant="h5">IntroGraphQL</Typography>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => <TextField {...field}
                placeholder="usuario"
                variant="outlined"
              />}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              type="password"
              render={({ field }) => <TextField {...field}
                placeholder="password"
                variant="outlined"
              />}
            />
            <Button variant="contained" type="submit">Acceder</Button>
            </form>
            {/* DAMOS RETROALIMENTACIÓN AL USUARIO */}
          </CardContent>
        </Card>
      </Container>
    </Div100vh>
  )
}

export default Login
