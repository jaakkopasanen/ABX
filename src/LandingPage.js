import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {Button, Link, makeStyles, Paper, SvgIcon} from "@material-ui/core";

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
        marginLeft: -500,
        [theme.breakpoints.up('sm')]: {
            marginLeft: -450
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: -400
        },
        [theme.breakpoints.up('lg')]: {
            marginLeft: -350
        }
    },
    contentImage: {
        borderRadius: 8
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
                        <Box mt={2}>
                            <Link href="https://github.com/jaakkopasanen/ABX" target="_blank" rel="noopener">
                                <Button variant="contained" startIcon={<GitHubIcon />}>Watch</Button>
                            </Link>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" mb={16}>
                        <Box display="flex" flexDirection="column" className={classes.bannerTitle}>
                            <Box mt={-6} mb={3}>
                                <Typography variant="h2">Listening tests in the browser</Typography>
                            </Box>
                            <Box mb="36px">
                                <Typography>
                                    Run double blind listening tests on any device super easily.
                                </Typography>
                            </Box>
                            <Box>
                                <Link href="/?test=demo.yml" target="_blank" rel="noopener">
                                    <Button variant="contained" color="secondary" size="large">Try the Demo</Button>
                                </Link>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                            <Box>
                                <Paper>
                                    <Box p={2}>
                                        <img src="results.png" alt="results table" />
                                    </Box>
                                </Paper>
                            </Box>
                            <Box className={classes.bannerStackedImage}>
                                <Paper>
                                    <Box p={2}>
                                        <img src="welcome.png" alt="welcome screen" />
                                    </Box>
                                </Paper>
                            </Box>
                            <Box className={classes.bannerStackedImage}>
                                <Paper>
                                    <Box p={2}>
                                        <img src="ab-test.png" alt="AB test screen" />
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>

                    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" spacing={10}>
                        <Box display="flex" flexDirection="row">
                            <Box>
                                <Box mb={1.5}>
                                    <Typography variant="h3">Simplicity, flexibilty</Typography>
                                </Box>
                                <Typography paragraph={true}>
                                    No writing code, no deployments, no setting up servers or
                                    anything like that. Simply declare your test and give the link to the test
                                    participants.
                                </Typography>
                                <Typography paragraph={true}>
                                    The tests are declared with a human-friendly YAML syntax. It's easy to write and
                                    easy to read.
                                </Typography>
                                <Typography paragraph={true}>
                                    Each test session can contain any number of tests. Each test can contain up to
                                    7 different audio clips. Each test can also be repeated as many times as needed
                                    to ensure statistical significance.
                                </Typography>
                            </Box>
                            <Box ml={3} mt={2}>
                                <img src="yaml-example.png" className={classes.contentImage} alt="Configuration file" />
                            </Box>
                        </Box>

                        <Box display="flex" flexDirection="row" mt={6}>
                            <Box flexGrow="1" flexBasis="0">
                                <Box mb={1.5}>
                                    <Typography variant="h3">Unbiased</Typography>
                                </Box>
                                <Typography paragraph={true}>
                                    ABX app has been designed with the goal of minimizing the biases and maximizing
                                    user experience.
                                </Typography>
                                <Typography paragraph={true}>
                                    The options presented to the user are shuffled automatically with
                                    Fisher-Yates algorithm which ensures that all possible orders are equally probable.
                                </Typography>
                                <Typography paragraph={true}>
                                    Buttons are arranged in a circular pattern to make it equally easy for the user to
                                    select each one.
                                </Typography>
                                <Typography paragraph={true}>
                                    All the different audio clips play in sync and user can switch between the clips
                                    without having to start from the beginning.
                                </Typography>
                            </Box>
                            <Box flexGrow="1" flexBasis="0" ml={3} mt={2} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                                <img src="button-group.png" height="203px" alt="Button group" />
                            </Box>
                        </Box>

                        <Box display="flex" flexDirection="row" mt={6}>
                            <Box flexGrow="1" flexBasis="0">
                                <Box mb={1.5}>
                                    <Typography variant="h3">Statistician at your service</Typography>
                                </Box>
                                <Typography paragraph={true}>
                                    Results are calculated at the end of each test. The participant is presented with
                                    the summary of her/his selections. p-value is calculated automatically for each
                                    individual test with the polynomial probability mass function.
                                </Typography>
                                <Typography paragraph={true}>
                                    As an extra treat, ABX app calculates aggregated statistics based on tags you've
                                    specified. Want to know how different filters or codecs stack up across all the
                                    different songs? This is the way.
                                </Typography>
                                <Typography paragraph={true}>
                                    The same statistics will be sent to your email after each participant has completed
                                    the test suite. Gather up the files and run your stats on the whole population.
                                    You can even specify a survey form in the welcome screen to get data about different
                                    demographics.
                                </Typography>
                            </Box>
                            <Box flexGrow="1" flexBasis="0" ml={3} mt={2}>
                                <Paper>
                                    <Box p={2}>
                                        <img src="result-table.png" alt="Result table" />
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>

                        <Box display="flex" flexDirection="row" mt={6} mb={12}>
                            <Box flexGrow="1" flexBasis="0">
                                <Box mb={1.5}>
                                    <Typography variant="h3">Get started</Typography>
                                </Box>
                                <Typography paragraph={true}>
                                    Start creating your own listening tests now. Head to the project's GitHub page&nbsp;
                                    <Link href="https://github.com/jaakkopasanen/ABX"  target="_blank" rel="noopener">
                                        jaakkopasanen/ABX
                                    </Link> for a guide on how to declare your own test.
                                </Typography>
                                <Typography paragraph={true}>
                                    In case you want to host ABX app your self, say you have some super secret and
                                    important test to conduct, you can do that easily too. You'll find the details on
                                    how to deploy your own ABX app in a docker container in no time. It's all open
                                    source!
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}
