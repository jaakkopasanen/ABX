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
import chdtr from "./stats";

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
        };
        let totalCount = 0;
        let x2Sum = 0;
        for (let j = 0; j < this.props.choices.length; ++j) {
            let exists = false;
            for (let k = 0; k < stats.options.length; ++k) {
                if (stats.options[k].name === this.props.choices[j].name) {
                    ++stats.options[k].count;
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                stats.options.push({
                    name: this.props.choices[j].name,
                    count: 1,
                });
            }
            ++totalCount;
        }
        stats.totalCount = totalCount;

        for (let name of stats.optionNames) {
            if (!stats.options.map(option => option.name).includes(name)) {
                stats.options.push({
                    name: name,
                    count: 0
                });
            }
        }

        for (let j = 0; j < stats.options.length; ++j) {
            const count = stats.options[j].count;
            const expectation = totalCount / stats.nOptions;  // Equal number of counts expected
            stats.options[j].percentage = stats.options[j].count / totalCount * 100;
            stats.options[j].x2 = (count - expectation)**2 / expectation;
            x2Sum += stats.options[j].x2;
        }
        stats.x2Sum = x2Sum;
        stats.options.sort((a, b) => b.count - a.count);
        stats.pValue = 1 - chdtr(x2Sum, stats.nOptions - 1);

        return stats;
    }

    render() {
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
                    <TableCell>{stats.options[j].x2.toFixed(1)}</TableCell>
                </TableRow>
            )
        }
        // Sum row
        rows.push(
            <TableRow key={-1}>
                <StyledTableCell>Sum</StyledTableCell>
                <StyledTableCell>{stats.totalCount} (100.0%)</StyledTableCell>
                <StyledTableCell>{stats.x2Sum.toFixed(1)}</StyledTableCell>
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
                            <b>p-value</b> {stats.pValue.toPrecision(3)}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        )
    }
}

export default ABStats;
