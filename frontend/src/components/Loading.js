import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  full: {
    zIndex: 2000,
    color: theme.palette.secondary.main,
  },
}));

const Loading = () => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.full} open={true}>
      <CircularProgress size={62} />
    </Backdrop>
  )
}

export default Loading;