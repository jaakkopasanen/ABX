import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {Divider, Grid, makeStyles, SvgIcon} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
    root: {
        background: 'white',
        position: "absolute",
        top: 0, bottom: 0, left: 0, right: 0,
        overflowX: "hidden",
        overflowY: "scroll"
    },
    topBar: {
        height: 96,
    },
    fullHeight: {
        height: "100%"
    },
    fullWidth: {
        width: "100%"
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
                                <Button variant="outlined" startIcon={<GitHubIcon />}>Watch</Button>
                            </Link>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Box display="flex" flexDirection="column">
                            <Box mb="24px">
                                <Typography variant="h2">Double blind</Typography>
                            </Box>
                            <Box mb="24px">
                                <Typography>
                                    Create and conduct listening tests easily. Get started in just a couple of minutes.
                                </Typography>
                            </Box>
                            <Box>
                                <Button variant="outlined" color="secondary" size="large">Try the Demo</Button>
                            </Box>
                        </Box>
                        <Grid item xs={6}>
                            {/*<img src="https://www.apple.com/euro/ios/app-store/b/screens_alt/images/og.png?202007290247" />*/}
                            <img src="banner.png" />
                        </Grid>
                    </Box>

                    <Divider className="width100p" />

                    <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={10}>
                        <Grid item>
                            <Typography variant="h3">Lorem ipsum</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}
