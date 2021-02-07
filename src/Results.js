import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ABStats from './ABStats';

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
            <Box display="flex" flexDirection="column">
                <Box mb="16px">
                    <Typography variant="h3">{this.props.title || 'Thank you!'}</Typography>
                </Box>
                <Typography>{this.props.description}</Typography>
                <Box mt="32px" mb="16px">
                    <Typography variant="h4">Your answers</Typography>
                </Box>
                {allStats}
            </Box>
        )
    }
}

export default Results;
