import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import {Tooltip, withStyles} from "@material-ui/core";
import Label from "./Label";

const StyledTableCell = withStyles((theme) => ({
    root: {
        fontWeight: 'bold',
    },
}))(TableCell);

class ABXStats extends React.Component {
    render() {
        const stats = Object.assign({}, this.props.stats);
        const rows = [];
        for (let i = 0; i < stats.rows.length; ++i) {
            // Add header cell
            let cells = [(
                <TableCell key={-1}>
                    <Label color="secondary"><b>{i + 1}</b></Label>{stats.rows[i].correctOption}
                </TableCell>
            )];
            // Add data cells
            for (let j = 0; j < stats.rows.length; ++j) {
                const count = (
                    <Tooltip title={stats.rows[j].correctOption}>
                        <Box>{stats.rows[i].counts[stats.rows[j].correctOption]}</Box>
                    </Tooltip>
                );
                if (i === j) {
                    cells.push(<StyledTableCell key={j}>{count}</StyledTableCell>)
                } else {
                    cells.push(<TableCell key={j}>{count}</TableCell>)
                }

            }
            // Data rows
            rows.push(
                <TableRow key={i}>
                    {cells}
                </TableRow>
            )
        }

        const headerCells = [];
        for (let i = 0; i < this.props.optionNames.length; ++i) {
            headerCells.push(
                <StyledTableCell key={i}>
                    <Label color="secondary">{i + 1}</Label>
                </StyledTableCell>
            )
        }
        return (
            <Box>
                <Typography variant="h6">
                    {this.props.name}
                </Typography>
                <Box mb={3}>
                    <Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell colSpan={this.props.optionNames.length} align="left">You selected</StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell>X is</StyledTableCell>
                                        {headerCells}
                                    </TableRow>
                                </TableHead>
                                <TableBody className="tableWithSumRow">
                                    {rows}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box mt={2}>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            <Box mr={1} display="inline">p-value</Box>
                                            <Tooltip title="ABX test p-value tells how likely it is for an equally or more extreme pair of correct and incorrect choices to happen purely randomly. In other words low p-values (<0.05) tells that most likely you had some influence in these results.">
                                                <Box display="inline">
                                                    <Label color="primary">?</Label>
                                                </Box>
                                            </Tooltip>
                                        </StyledTableCell>
                                        <StyledTableCell>Correct</StyledTableCell>
                                        <StyledTableCell>Incorrect</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{stats.pValue.toPrecision(3)}</TableCell>
                                        <TableCell>{stats.correctCount}</TableCell>
                                        <TableCell>{stats.incorrectCount}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default ABXStats;
