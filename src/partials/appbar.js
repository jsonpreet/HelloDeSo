import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BitcloutLogin from '../services/BitcloutLogin.js'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
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

export default function HeaderAppBar() {
    const classes = useStyles();


    const responseClout = (response) => {
        if(!localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(response, null, 2));
        }
    }
    const accessLevel = 2;
    const JWT = false;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            CloutSpot
          </Typography>
          <BitcloutLogin accessLevel={accessLevel} onSuccess={responseClout} onFailure={responseClout} JWT={JWT} /> 
        </Toolbar>
      </AppBar>
    </div>
  );
}