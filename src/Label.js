import React from "react";
import {Box, makeStyles} from "@material-ui/core";

export default function Label(props) {
    const { children, ...other } = props;
    const classes = makeStyles(theme => ({
        root: {
            display: "inline-block",
            backgroundColor: theme.palette[props.color].main,
            color: 'white',
            borderRadius: 3,
            padding: '0 4px 0 4px',
            margin: '0 4px 0 -4px'
        }
    }))();
    return (
        <Box className={classes.root} {...other}>{children}</Box>
    );
};