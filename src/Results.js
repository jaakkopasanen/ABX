import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ABStats from './ABStats';
import reactMuiMarkdownRenderers from "./reactMuiMarkdownRenderers";
import ReactMarkdown from "react-markdown";

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
                        choices={this.props.results[i].choices}
                    />
                )
            }
            allStats.push(
                <Box key={i} mb="12px">
                    {stats}
                </Box>
            )
        }
        return (
            <Box mt="16px" className="width100p">
                <Paper>
                    <Box display="flex" flexDirection="column" p="16px">
                        <Box key={-1} mb="16px">
                            <ReactMarkdown renderers={reactMuiMarkdownRenderers} children={this.props.description} />
                        </Box>
                        {allStats}
                    </Box>
                </Paper>
            </Box>

        )
    }
}

export default Results;
