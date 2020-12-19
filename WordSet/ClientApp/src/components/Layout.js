import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Container from '@material-ui/core/Container';
import { Switch } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
    },
    imageIcon: {
        height: '100%',
    },
    iconRoot: {
        textAlign: 'center',
    }
}));

export function Layout(props) {
    const classes = useStyles();

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Icon className={classes.iconRoot}>
                        <img className={classes.imageIcon} src="/cutecat2.svg" />
                    </Icon>
                    <Typography variant="h6" className={classes.title}>
                        Word List Calculator
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/">Home</Button>
                    <Button color="inherit" component={RouterLink} to="/about">About</Button>
                </Toolbar>
            </AppBar>
            <Switch>
                {props.children}
            </Switch>
        </Container>
    );
}
