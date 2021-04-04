import React from "react";
import ReactMarkdown from 'react-markdown';
import {Box, Button, Paper, TextField, MenuItem, Container, Typography} from "@material-ui/core";
import reactMuiMarkdownRenderers from "./reactMuiMarkdownRenderers";

class Welcome extends React.Component {
    constructor(props) {
        super(props);

        const form = {};
        if (this.props.form !== undefined) {
            for (let i = 0; i < this.props.form.length; ++i) {
                form[this.props.form[i].name] = '';
            }
        }
        this.state = form;

        this.handleClick = this.handleClick.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleClick() {
        this.props.onClick(Object.assign({}, this.state));
    }

    renderForm() {
        if (!this.props.form || !this.props.form.length) {
            return '';
        }
        const inputs = [];
        for (let i = 0; i < this.props.form.length; ++i) {
            let input;
            if (this.props.form[i].inputType === 'text') {
                input = (
                    <TextField
                        label={this.props.form[i].name}
                        className="width100p"
                        value={this.state[this.props.form[i].name]}
                    />
                );

            } else if (this.props.form[i].inputType === 'number') {
                input = (
                    <TextField
                        type="number"
                        label={this.props.form[i].name}
                        className="width100p"
                        value={this.state[this.props.form[i].name]}
                        onChange={(event) => {
                            const newState = {};
                            newState[this.props.form[i].name] = event.target.value;
                            this.setState(newState);
                        }}
                    />
                );

            } else if (this.props.form[i].inputType === 'select') {
                input = (
                    <TextField
                        label={this.props.form[i].name}
                        select
                        className="width100p"
                        value={this.state[this.props.form[i].name]}
                        onChange={(event) => {
                            const newState = {};
                            newState[this.props.form[i].name] = event.target.value;
                            this.setState(newState);
                        }}
                    >
                        {this.props.form[i].options.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                )
            }
            inputs.push(<Box key={i} mb="12px">{input}</Box>)
        }
        return (
            <Box display="flex" flexDirection="column" alignSelf="stretch">
                {inputs}
            </Box>
        );
    }

    validateForm() {
        let isValid = true;
        if (this.props.form !== undefined) {
            for (let field of this.props.form) {
                isValid = isValid && this.state[field.name] !== '';
            }
        }
        return isValid;
    }

    render() {
        return (
            <Box className="greyBg" pt={2} pb={2}>
                <Container maxWidth="sm">
                    <Box>
                        <Paper>
                            <Box p="20px">
                                <Box key={0} mt="16px">
                                    <ReactMarkdown renderers={reactMuiMarkdownRenderers} children={this.props.description} />
                                </Box>
                                <Box key={1} display={this.props.form ? 'flex' : 'none'} flexDirection="column">
                                    {this.renderForm()}
                                </Box>
                                <Box display={this.props.initialized ? 'none' : 'inline'}>
                                    <Typography color="primary">
                                        Loading audio...
                                    </Typography>
                                </Box>
                                <Box key={2} mt="32px" mb="16px" display="flex" justifyContent="center">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={this.handleClick}
                                        disabled={!this.validateForm() || !this.props.initialized}
                                    >
                                        Start!
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            </Box>
        )
    }
}

export default Welcome;
