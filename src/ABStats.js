import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import {withStyles} from "@material-ui/core";
import { abStats } from "./stats";

const StyledTableCell = withStyles((theme) => ({
    root: {
        fontWeight: 'bold',
    },
}))(TableCell);

class ABStats extends React.Component {
    render() {
        if (!this.props.userSelections.length) {
            return '';
        }
        const stats = abStats(this.props.name, this.props.optionNames, this.props.userSelections);
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
        // p-value row
        rows.push(
            <TableRow key={-2}>
                <StyledTableCell>p-value</StyledTableCell>
                <StyledTableCell>{stats.pValue.toPrecision(3)}</StyledTableCell>
            </TableRow>
        )
        return (
            <Box>
                <Typography variant="h6">{stats.name}</Typography>
                <Box mb="24px">
                    <TableContainer>
                        <Table size="small">
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
            </Box>
        )
    }
}

export default ABStats;
