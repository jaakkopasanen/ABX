import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ABStats from './ABStats';
import ABXStats from "./ABXStats";
import reactMuiMarkdownRenderers from "./reactMuiMarkdownRenderers";
import ReactMarkdown from "react-markdown";
import Typography from "@material-ui/core/Typography";
import ABTagStats from "./ABTagStats";
import ABXTagStats from "./ABXTagStats";
import {computeAbStats, computeAbTagStats, computeAbxStats, computeAbxTagStats} from "./stats";
import {createShareUrl} from "./share";
import {Button, IconButton, Link, Tooltip} from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shared: false,
            isCopiedTooltipOpen: false,
        };
        this.shareUrl = null;
        this.handleShareClick = this.handleShareClick.bind(this);
        this.handleCopyClick = this.handleCopyClick.bind(this);
    }

    handleShareClick() {
        this.setState({shared: true});
    }

    handleCopyClick(shareUrl) {
        // Write share URL to clipboard
        navigator.clipboard.writeText(shareUrl);
        // Open tooltip
        this.setState({isCopiedTooltipOpen: true});
        // Close tooltip after 1 second
        setTimeout(() => {this.setState({isCopiedTooltipOpen: false})}, 1000);
    }

    render() {
        // Exit if some tests are still not done
        for (const results of this.props.results) {
            const targetCount = this.props.config.tests.find(test => test.name === results.name).repeat;
            let count = 0;
            if (results.testType.toLowerCase() === 'ab') {
                if (results.stats) {
                    count = results.stats.options.reduce((count, option) => count + option.count, 0);
                } else {
                    count = results.userSelections.length;
                }
            } else if (results.testType.toLowerCase() === 'abx') {
                if (results.stats) {
                    // Use existing stats to get the total count
                    for (const row of results.stats.rows) {
                        count += Object.values(row.counts).reduce((a, b) => a + b, 0);
                    }
                } else {
                    // Count is the number of selections user has already made
                    count = results.userSelectionsAndCorrects.length;
                }
            } else {
                throw new Error(`Unsupported test type "${results.testType}`);
            }
            // Exit if some user selections are still missing
            if (count < targetCount) {
                return null;
            }
        }

        const abStats = [];
        const abStatsComponents = [];
        const abxStats = [];
        const abxStatsComponents = [];
        for (let i = 0; i < this.props.results.length; ++i) {  // Looping tests
            if (this.props.results[i].testType.toLowerCase() === 'ab') {
                let stats;
                if (this.props.results[i].stats) {
                    stats = this.props.results[i].stats;
                } else {
                    stats = computeAbStats(
                        this.props.results[i].name,
                        this.props.results[i].optionNames,
                        this.props.results[i].userSelections
                    );
                }
                abStats.push(stats);
                abStatsComponents.push(
                    <ABStats
                        key={i}
                        name={this.props.results[i].name}
                        stats={stats}
                    />
                )

            } else if (this.props.results[i].testType.toLowerCase() === 'abx') {
                let stats;
                if (this.props.results[i].stats) {
                    stats = this.props.results[i].stats;
                } else {
                    stats = computeAbxStats(
                        this.props.results[i].name,
                        this.props.results[i].optionNames,
                        this.props.results[i].userSelectionsAndCorrects
                    );
                }
                abxStats.push(stats);
                abxStatsComponents.push(
                    <ABXStats
                        key={i}
                        name={this.props.results[i].name}
                        optionNames={this.props.results[i].optionNames}
                        stats={stats}
                    />
                )
            }
        }

        // Get AB and ABX test tag stats
        const abTagStats = computeAbTagStats(abStats, this.props.config);
        const abxTagStats = computeAbxTagStats(abxStats, this.props.config);
        if (this.shareUrl === null) {
            this.shareUrl = createShareUrl(abStats.concat(abxStats), this.props.config);
        }
        return (
            <Box>
                <Paper>
                    <Box display="flex" flexDirection="column" p="16px">
                        {this.props.description &&
                        <Box key={-1} mb="16px">
                            <ReactMarkdown renderers={reactMuiMarkdownRenderers} children={this.props.description}/>
                        </Box>}
                        {abStatsComponents}
                        {abxStatsComponents}
                        {Boolean(abTagStats && abTagStats.length) &&
                        <Box>
                            <Box mb="16px">
                                <Typography variant="h5">Aggregated AB test results</Typography>
                            </Box>
                            <Box>
                                <ABTagStats config={this.props.config} stats={abTagStats} />
                            </Box>
                        </Box>}
                        {Boolean(abxTagStats && abxTagStats.length) &&
                        <Box>
                            <Box mb="16px">
                                <Typography variant="h5">Aggregated ABX test results</Typography>
                            </Box>
                            <Box>
                                <ABXTagStats config={this.props.config} stats={abxTagStats} />
                            </Box>
                        </Box>
                        }
                        {this.shareUrl &&
                        <Box>
                            <Box className="centerText" display={this.state.shared ? 'none': 'block'}>
                                <Button color="secondary" startIcon={<ShareIcon />} onClick={this.handleShareClick}>
                                    Share your results
                                </Button>
                            </Box>
                            <Box display={this.state.shared ? 'block': 'none'}>
                                <Box display="flex" flexDirection="row" justifyContent="center">
                                    <Box display="flex" alignItems="center" className="scrollableLink">
                                        <Typography align="center">
                                            <Link href={this.shareUrl} target="_blank" rel="noopener">
                                                {this.shareUrl}
                                            </Link>
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Tooltip
                                            open={this.state.isCopiedTooltipOpen}
                                            disableFocusListener
                                            disableHoverListener
                                            disableTouchListener
                                            placement="top"
                                            title="Copied!"
                                        >
                                            <IconButton
                                                color="primary"
                                                onClick={() => { this.handleCopyClick(this.shareUrl); }}
                                            >
                                                <FileCopyIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        }
                    </Box>
                </Paper>
            </Box>
        )
    }
}

export default Results;
