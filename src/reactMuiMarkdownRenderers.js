import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {TableHead, TableRow, TableCell, TableBody} from "@material-ui/core";

const styles = (theme) => ({
    listItem: {
        marginTop: theme.spacing(0),
    },
    header: {
        marginTop: theme.spacing(2),
    },
    paragraph: {
        marginBottom: theme.spacing(2),
    }
});

const MarkdownParagraph = withStyles(styles)(({ classes, ...props }) => {
    return <Typography className={classes.paragraph}>{props.children}</Typography>
});

const MarkdownHeading = withStyles(styles)(({ classes, ...props }) => {
    return <Typography className={classes.header} gutterBottom variant={`h${props.level}`}>{props.children}</Typography>
});

const MarkdownListItem = withStyles(styles)(({ classes, ...props }) => {
    return (
        <li className={classes.listItem}>
            <Typography component="span">{props.children}</Typography>
        </li>
    );
});

function MarkdownTable(props) {
    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">{props.children}</Table>
        </TableContainer>
    );
}

function MarkdownTableCell(props) {
    return <TableCell><Typography>{props.children}</Typography></TableCell>
}

function MarkdownTableRow(props) {
    return <TableRow>{props.children}</TableRow>
}

function MarkdownTableBody(props) {
    return <TableBody>{props.children}</TableBody>
}

function MarkdownTableHead(props) {
    return <TableHead>{props.children}</TableHead>
}

const reactMuiMarkdownRenderers = {
    heading: MarkdownHeading,
    paragraph: MarkdownParagraph,
    link: Link,
    listItem: MarkdownListItem,
    table: MarkdownTable,
    tableHead: MarkdownTableHead,
    tableBody: MarkdownTableBody,
    tableRow: MarkdownTableRow,
    tableCell: MarkdownTableCell,
};

export default reactMuiMarkdownRenderers;
