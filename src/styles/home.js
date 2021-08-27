import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    loginButton: {
      backgroundColor: '#FFFFFF',
      textTransform: 'uppercase'
    }
    
  }));
 
export default useStyles;