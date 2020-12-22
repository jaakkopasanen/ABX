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
import { withStyles } from "@material-ui/core";
import chdtr from './stats';


const StyledTableCell = withStyles((theme) => ({
    root: {
        fontWeight: 'bold',
    },
}))(TableCell);


class ThankYou extends React.Component {
    computeStats() {
        const allStats = [];
        for (let i = 0; i < this.props.results.length; ++i) {  // Looping tests
            const testStats = {
                name: this.props.results[i].test,
                options: [],
                nOptions: this.props.results[i].optionNames.length,
                optionNames: this.props.results[i].optionNames.slice(),
            };
            let totalCount = 0;
            let x2Sum = 0;
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

            for (let name of testStats.optionNames) {
                if (!testStats.options.map(option => option.name).includes(name)) {
                    testStats.options.push({
                        name: name,
                        count: 0
                    });
                }
            }

            for (let j = 0; j < testStats.options.length; ++j) {
                const count = testStats.options[j].count;
                const expectation = totalCount / testStats.nOptions;  // Equal number of counts expected
                testStats.options[j].percentage = testStats.options[j].count / totalCount * 100;
                testStats.options[j].x2 = (count - expectation)**2 / expectation;
                x2Sum += testStats.options[j].x2;
            }
            testStats.x2Sum = x2Sum;
            testStats.options.sort((a, b) => b.count - a.count);
            testStats.pValue = 1 - chdtr(x2Sum, testStats.nOptions - 1);

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
                        <TableCell>
                            {allStats[i].options[j].count} ({allStats[i].options[j].percentage.toFixed(1)}%)
                        </TableCell>
                        <TableCell>{allStats[i].options[j].x2.toFixed(1)}</TableCell>
                    </TableRow>
                )
            }
            rows.push(
                <TableRow key={-1}>
                    <StyledTableCell>Sum</StyledTableCell>
                    <StyledTableCell>{allStats[i].totalCount} (100.0%)</StyledTableCell>
                    <StyledTableCell>{allStats[i].x2Sum.toFixed(1)}</StyledTableCell>
                </TableRow>
            )
            // Add a table for each test
            results.push(
                <Box key={i} mb="12px">
                    <Paper>
                        <Box p="16px">
                            <Box mb="16px">
                                <Typography variant="h5">{allStats[i].name}</Typography>
                            </Box>
                            <Box mb="32px">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Sample</StyledTableCell>
                                                <StyledTableCell>Selected</StyledTableCell>
                                                <StyledTableCell>X<sup>2</sup></StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="tableWithSumRow">
                                            {rows}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            <Box>
                                <Typography>
                                    <b>p-value</b> {allStats[i].pValue.toPrecision(3)}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
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