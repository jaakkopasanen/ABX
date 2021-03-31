import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {Divider, Grid, makeStyles, Paper, SvgIcon} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundImage: "url('poly.png')",
        backgroundColor: "white",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        overflowX: "hidden",
        overflowY: "auto"
    },
    topBar: {
        height: 96,
    },
    bannerTitle: {
        minWidth: 200,
        [theme.breakpoints.up('md')]: {
            minWidth: 300,
            marginRight: 48
        },
    },
    bannerStackedImage: {
        marginLeft: "-500px",
        [theme.breakpoints.up('sm')]: {
            marginLeft: "-450px"
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: "-400px"
        },
        [theme.breakpoints.up('lg')]: {
            marginLeft: "-350px"
        }
    }
}));

function GitHubIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </SvgIcon>
    )
}


export default function LandingPage() {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Container maxWidth="md">
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <img src="android-chrome-192x192.png" height="96px" alt="ABX logo" />
                        </Box>
                        <Box mt="16px">
                            <Link href="https://github.com/jaakkopasanen/ABX" target="_blank" rel="noopener" rel="noreferrer">
                                <Button variant="contained" startIcon={<GitHubIcon />}>Watch</Button>
                            </Link>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Box display="flex" flexDirection="column" className={classes.bannerTitle}>
                            <Box mt="-48px" mb="24px">
                                <Typography variant="h2">Double blind</Typography>
                            </Box>
                            <Box mb="36px">
                                <Typography>
                                    Create and conduct listening tests easily. Get started in just a couple of minutes.
                                </Typography>
                            </Box>
                            <Box>
                                <Link href="/?test=demo.yml" target="_blank" rel="noopener" rel="noreferrer">
                                    <Button variant="contained" color="secondary" size="large">Try the Demo</Button>
                                </Link>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                            <Box>
                                <Paper>
                                    <Box p="16px">
                                        <img src="results.png" />
                                    </Box>
                                </Paper>
                            </Box>
                            <Box className={classes.bannerStackedImage}>
                                <Paper>
                                    <Box p="16px">
                                        <img src="welcome.png" />
                                    </Box>
                                </Paper>
                            </Box>
                            <Box className={classes.bannerStackedImage}>
                                <Paper>
                                    <Box p="16px">
                                        <img src="ab-test.png" />
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>

                    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" spacing={10}>
                        <Box mt="24px">
                            <Typography variant="h3">Lorem ipsum</Typography>
                        </Box>
                    </Box>

                </Box>
            </Container>
        </Box>
    )
}
