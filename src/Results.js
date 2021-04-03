import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ABStats from './ABStats';
import ABXStats from "./ABXStats";
import reactMuiMarkdownRenderers from "./reactMuiMarkdownRenderers";
import ReactMarkdown from "react-markdown";
import Typography from "@material-ui/core/Typography";
import ABTagStats from "./ABTagStats";
import {computeAbStats, computeAbTagStats, computeAbxStats, computeAbxTagStats} from "./stats";
import {createShareUrl} from "./share";
import {Button, IconButton, Link, Tooltip} from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ABXTagStats from "./ABXTagStats";

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
        const testStats = [];
        for (let i = 0; i < this.props.results.length; ++i) {  // Looping tests
            let stats;
            if (this.props.results[i].testType.toLowerCase() === 'ab') {
                stats = (
                    <ABStats
                        name={this.props.results[i].name}
                        optionNames={this.props.results[i].optionNames}
                        userSelections={this.props.results[i].userSelections}
                        stats={this.props.results[i].stats}
                    />
                )
            } else if (this.props.results[i].testType.toLowerCase() === 'abx') {
                stats = (
                    <ABXStats
                        name={this.props.results[i].name}
                        optionNames={this.props.results[i].optionNames}
                        userSelectionsAndCorrects={this.props.results[i].userSelectionsAndCorrects}
                        stats={this.props.results[i].stats}
                    />
                )
            }
            testStats.push(
                <Box key={i} mb="12px">
                    {stats}
                </Box>
            )
        }

        // Get AB test tag stats
        const abTagStats = computeAbTagStats(
            this.props.results
                // Filter out other type tests
                .filter(result =>result.testType.toLowerCase() === 'ab')
                // Compute AB test stats for each test result
                .map(result => {
                    if (result.userSelections) {
                        // Result has user selections, use those
                        return computeAbStats(result.name, result.optionNames, result.userSelections);
                    }
                    // No user selections available (in shared results), use the precomputed stats
                    return result.stats;
                }),
            this.props.config
        );
        const abxTagStats = computeAbxTagStats(
            this.props.results
                // Filter out other type tests
                .filter(result => result.testType.toLowerCase() === 'abx')
                // Compute ABX test stats for each test result
                .map(result => {
                    if (result.userSelectionsAndCorrects) {
                        return computeAbxStats(result.name, result.optionNames, result.userSelectionsAndCorrects);
                    }
                    return result.stats;
                }),
            this.props.config
        );
        if (this.shareUrl === null) {
            this.shareUrl = createShareUrl(this.props.results, this.props.config);
        }
        return (
            <Box>
                <Paper>
                    <Box display="flex" flexDirection="column" p="16px">
                        {this.props.description &&
                        <Box key={-1} mb="16px">
                            <ReactMarkdown renderers={reactMuiMarkdownRenderers} children={this.props.description}/>
                        </Box>}
                        {testStats}
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
                                <ABXTagStats config={this.props.config} results={abxTagStats} />
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
