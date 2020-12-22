import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class ThankYou extends React.Component {
    computeStats() {
        const allStats = [];
        for (let i = 0; i < this.props.results.length; ++i) {  // Looping tests
            const testStats = {
                name: this.props.results[i].test,
                options: [],
            };
            let totalCount = 0;
            for (let j = 0; j < this.props.results[i].choices.length; ++j) {
                let exists = false;
                for (let k = 0; k < testStats.options.length; ++k) {
                    if (testStats.options[k].name === this.props.results[i].choices[j].name) {
                        ++testStats.options[k].count;
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    testStats.options.push({
                        name: this.props.results[i].choices[j].name,
                        count: 1,
                    });
                }
                ++totalCount;
            }
            testStats.totalCount = totalCount;
            for (let j = 0; j < testStats.options.length; ++j) {
                testStats.options[j].percentage = testStats.options[j].count / totalCount * 100;
            }
            testStats.options.sort((a, b) => b.count - a.count);
            allStats.push(testStats);
        }
        return allStats;
    }

    render() {
        const results = [];
        const allStats = this.computeStats()
        for (let i = 0; i < allStats.length; ++i) {  // Looping tests
            const rows = [];
            for (let j = 0; j < allStats[i].options.length; ++j) {
                rows.push(
                    <TableRow key={j}>
                        <TableCell>{allStats[i].options[j].name}</TableCell>
                        <TableCell>{allStats[i].options[j].count}</TableCell>
                        <TableCell>{allStats[i].options[j].percentage.toFixed(1)}</TableCell>
                    </TableRow>
                )
            }
            // Add a table for each test
            results.push(
                <Box key={i} mb="48px">
                    <Box mb="16px">
                        <Typography variant="h5">{allStats[i].name}</Typography>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sample</TableCell>
                                    <TableCell>Selected</TableCell>
                                    <TableCell>Selected (%)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

                {results}
            </Box>
        )
    }
}

export default ThankYou;