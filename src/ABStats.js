import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import TableCell from "@material-ui/core/TableCell";
import {withStyles} from "@material-ui/core";
import { multinomialPMF } from "./stats";

const StyledTableCell = withStyles((theme) => ({
    root: {
        fontWeight: 'bold',
    },
}))(TableCell);

class ABStats extends React.Component {
    computeStats() {
        const stats = {
            name: this.props.name,
            options: [],
            nOptions: this.props.optionNames.length,
            optionNames: this.props.optionNames.slice(),
            totalCount: this.props.choices.length,
            x2Sum: 0,
        };

        // Iterate through user's choices
        for (let j = 0; j < this.props.choices.length; ++j) {
            // Find the option with the name of the current choice
            const option = stats.options.filter(option => option.name === this.props.choices[j].name);
            if (option.length) {
                // Found, increment count
                ++option[0].count;
            } else {
                // Doesn't exist, create new
                stats.options.push({
                    name: this.props.choices[j].name,
                    count: 1,
                });
            }
        }

        // Add options which were never selected with zero counts
        for (let name of stats.optionNames) {
            if (!stats.options.map(option => option.name).includes(name)) {
                stats.options.push({
                    name: name,
                    count: 0
                });
            }
        }
        for (let option of stats.options) {
            option.percentage = option.count / stats.totalCount * 100;
        }

        // Sort by counts
        stats.options.sort((a, b) => b.count - a.count);

        // Calculate p-value
        stats.pValue = multinomialPMF(stats.options.map(option => option.count), 1 / stats.nOptions);

        return stats;
    }

    render() {
        if (!this.props.choices.length) {
            return '';
        }
        const stats = this.computeStats();
        const rows = [];
        for (let j = 0; j < stats.options.length; ++j) {
            // Data rows
            rows.push(
                <TableRow key={j}>
                    <TableCell>{stats.options[j].name}</TableCell>
                    <TableCell>
                        {stats.options[j].count} ({stats.options[j].percentage.toFixed(1)}%)
                    </TableCell>
                </TableRow>
            )
        }
        // Sum row
        rows.push(
            <TableRow key={-1}>
                <StyledTableCell>Sum</StyledTableCell>
                <StyledTableCell>{stats.totalCount} (100.0%)</StyledTableCell>
            </TableRow>
        )
        return (
            <Paper>
                <Box p="16px">
                    <Box mb="16px">
                        <Typography variant="h5">{stats.name}</Typography>
                    </Box>
                    <Box mb="32px">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Sample</StyledTableCell>
                                        <StyledTableCell>Selected</StyledTableCell>
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
                            <b>p-value</b> {stats.pValue.toPrecision(3)}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        )
    }
}

export default ABStats;
