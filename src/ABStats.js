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

class ABStats extends React.Component {
    render() {
        const stats = Object.assign({}, this.props.stats);
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
                <StyledTableCell>
                    <Box mr={1} display="inline">p-value</Box>
                    <Tooltip title="AB test p-value tells how likely it is for an equally or more extreme combination of choices to happen purely randomly. In other words low p-values (<0.05) tells that most likely you had some influence in these results.">
                        <Box display="inline">
                            <Label color="primary">?</Label>
                        </Box>
                    </Tooltip>
                </StyledTableCell>
                <StyledTableCell>
                    {stats.pValue.toPrecision(3)}
                </StyledTableCell>
            </TableRow>
        )
        return (
            <Box>
                <Typography variant="h6">{this.props.name}</Typography>
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
