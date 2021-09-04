import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {Button, Link, makeStyles, Paper, SvgIcon} from "@material-ui/core";
import ABStats from "./ABStats";
import ABTagStats from "./ABTagStats";

const abStats = {
    pValue: 0.00610,
    options: [
        {name: 'Hotel California (Lossless)', count: 7, percentage: 70},
        {name: 'Hotel California (256 kbps AAC)', count: 2, percentage: 20},
        {name: 'Hotel California (320 kbps MP3)', count: 1, percentage: 10}
    ]
};
const abTagStats = [{
    name: 'Lossless vs 256 kbps AAC vs 320 kbps MP3',
    pValue: 0.00000146,
    options: [
        {name: 'Lossless', count: 20, percentage: 66.666667},
        {name: '256 kbps AAC', count: 9, percentage: 90},
        {name: '320 kbps MP3', count: 1, percentage: 3.333333},
    ]
}];

function GitHubIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </SvgIcon>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundImage: 'url("poly.png")',
        backgroundColor: 'white',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    topBar: {
        height: 96,
    },
    banner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: -240,
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            marginBottom: 0,
        }
    },
    bannerTitle: {
        minWidth: 300,
        paddingTop: 48,
        [theme.breakpoints.up('sm')]: {
            marginRight: 48
        },
    },
    bannerImageStack: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: -240,
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginTop: 0,
            marginLeft: -140,
        }
    },
    bannerStackedImage: {
        boxShadow: '-50px 25px 30px rgba(0, 0, 0, 0.1)',
        transform: 'perspective(1000px) rotateY(6deg) scale(0.35)',
        marginLeft: -500,
        [theme.breakpoints.up('sm')]: {
            transform: 'perspective(1000px) rotateY(6deg) scale(0.6667)',
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: -450
        },
        '&:first-child': {
            marginLeft: 12
        }
    },
    doubleContent: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 48,
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
        },
    },
    doubleContentLeft: {
        minWidth: 288
    },
    doubleContentRight: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: 24,
        }
    },
    contentImage: {
        borderRadius: 8
    },
    resultsTable: {
        minWidth: 288,
        '@media (min-width: 700px)': {
            minWidth: 380
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: 24,
        }
    }
}));

export default function LandingPage() {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Container maxWidth="md">
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box mt={2}>
                            <img src="abx-logo-192x109.png" height="64px" alt="ABX logo" />
                        </Box>
                        <Box mt={2}>
                            <Link href="https://github.com/jaakkopasanen/ABX" target="_blank" rel="noopener">
                                <Button variant="contained" startIcon={<GitHubIcon />}>Watch</Button>
                            </Link>
                        </Box>
                    </Box>

                    <Box className={classes.banner}>
                        <Box display="flex" flexDirection="column" className={classes.bannerTitle}>
                            <Box mt={-6} mb={3}>
                                <Typography variant="h2">Listening Tests as a Service</Typography>
                            </Box>
                            <Box mb="36px">
                                <Typography>
                                    Run double blind listening tests in the browser on any device super easily.
                                </Typography>
                            </Box>
                            <Box>
                                <Link href="/?test=demo.yml" target="_blank" rel="noopener">
                                    <Button variant="contained" color="secondary" size="large">Try the Demo</Button>
                                </Link>
                            </Box>
                        </Box>
                        <Box className={classes.bannerImageStack}>
                            <Box className={classes.bannerStackedImage}>
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

                    <Box pb={12} spacing={10}>
                        <Box className={classes.doubleContent}>
                            <Box className={classes.doubleContentLeft}>
                                <Box mb={1.5}>
                                    <Typography variant="h3">Simplicity, flexibilty</Typography>
                                </Box>
                                <Typography paragraph={true}>
                                    ABX app creates the tests for you.
                                </Typography>
                                <Typography paragraph={true}>
                                    No writing code, no deployments, no setting up servers or
                                    configuring devices. Simply declare your test and give the link to the test
                                    participants.
                                </Typography>
                                <Typography paragraph={true}>
                                    The tests are declared with a human-friendly YAML syntax. It's easy to write and
                                    easy to read.
                                </Typography>
                                <Typography paragraph={true}>
                                    Each test session can contain any number of tests, each test can contain any number
                                    of audio clips and can also be repeated as many times as needed to ensure
                                    statistical significance.
                                </Typography>
                            </Box>
                            <Box mt={2} className={classes.doubleContentRight}>
                                <img src="yaml-example.png" className={classes.contentImage} alt="Configuration file" />
                            </Box>
                        </Box>

                        <Box className={classes.doubleContent}>
                            <Box className={classes.doubleContentLeft}>
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
                            <Box mt={2}
                                 display="flex" flexDirection="row" justifyContent="center" alignItems="center"
                                 className={classes.doubleContentRight}
                            >
                                <img src="button-group.png" height="203px" alt="Button group" />
                            </Box>
                        </Box>

                        <Box className={classes.doubleContent}>
                            <Box className={classes.doubleContentLeft}>
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
                            <Box mt={2} className={`${classes.doubleContentRight} ${classes.resultsTable}`}>
                                <Paper>
                                    <Box p={2}>
                                        <ABStats
                                            name="Eagles - Hotel California"
                                            stats={abStats}
                                        /><Box>
                                        <Box mb="16px">
                                            <Typography variant="h5">Aggregated AB test results</Typography>
                                        </Box>
                                        <Box>
                                            <ABTagStats stats={abTagStats} />
                                        </Box>
                                    </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>

                        <Box className={classes.doubleContent}>
                            <Box>
                                <Box mb={1.5}>
                                    <Typography variant="h3">Get Started</Typography>
                                </Box>
                                <Typography paragraph={true}>
                                    Start creating your own listening tests now. Head to the project's&nbsp;
                                    <Link href="https://github.com/jaakkopasanen/ABX"  target="_blank" rel="noopener">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="medium"
                                            startIcon={<GitHubIcon />}
                                        >
                                            GitHub page
                                        </Button>
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
