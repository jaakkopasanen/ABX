import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ABStats from './ABStats';
import reactMuiMarkdownRenderers from "./reactMuiMarkdownRenderers";
import ReactMarkdown from "react-markdown";
import Typography from "@material-ui/core/Typography";
import TagStats from "./TagStats";
import {tagStats} from "./stats";

class Results extends React.Component {
    render() {
        const allStats = [];
        for (let i = 0; i < this.props.results.length; ++i) {  // Looping tests
            let stats;
            if (this.props.results[i].testType.toLowerCase() === 'ab') {
                stats = (
                    <ABStats
                        name={this.props.results[i].name}
                        optionNames={this.props.results[i].optionNames}
                        userSelections={this.props.results[i].userSelections}
                    />
                )
            }
            allStats.push(
                <Box key={i} mb="12px">
                    {stats}
                </Box>
            )
        }
        const tagSts = tagStats(this.props.results, this.props.config);
        return (
            <Box mt="16px" className="width100p">
                <Paper>
                    <Box display="flex" flexDirection="column" p="16px">
                        {this.props.description &&
                        <Box key={-1} mb="16px">
                            <ReactMarkdown renderers={reactMuiMarkdownRenderers} children={this.props.description}/>
                        </Box>}
                        {allStats}
                        {tagSts &&
                        <Box>
                            <Box mb="16px">
                                <Typography variant="h4">Aggregated results</Typography>
                            </Box>
                            <Box>
                                <TagStats config={this.props.config} results={this.props.results} />
                            </Box>
                        </Box>}
                    </Box>
                </Paper>
            </Box>
        )
    }
}

export default Results;
