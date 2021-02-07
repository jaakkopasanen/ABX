import React from "react";
import ReactMarkdown from 'react-markdown';
import { Box, Button, Paper, TextField, MenuItem } from "@material-ui/core";
import reactMuiMarkdownRenderers from "./reactMuiMarkdownRenderers";

class Welcome extends React.Component {
    constructor(props) {
        super(props);

        const form = {};
        for (let i = 0; i < this.props.form.length; ++i) {
            //form[this.props.form[i].name] = this.props.form[i].type === 'select' ? this.props.form[i].options[0] : '';
            form[this.props.form[i].name] = '';
        }
        this.state = form;

        this.handleClick = this.handleClick.bind(this);
        this.renderForm = this.renderForm.bind(this);
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
            if (this.props.form[i].type === 'text') {
                input = (
                    <TextField
                        label={this.props.form[i].name}
                        className="width100p"
                        value={this.state[this.props.form[i].name]}
                    />
                );

            } else if (this.props.form[i].type === 'number') {
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

            } else if (this.props.form[i].type === 'select') {
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

    render() {
        return (
            <Box mt="16px" className="width100p">
                <Paper>
                    <Box p="20px">
                        <Box key={0} mt="16px">
                            <ReactMarkdown renderers={reactMuiMarkdownRenderers} children={this.props.description} />
                        </Box>
                        <Box key={1} display={this.props.form ? 'flex' : 'none'} flexDirection="column">
                            {this.renderForm()}
                        </Box>
                        <Box key={2} mt="32px" mb="16px" display="flex" justifyContent="center">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.handleClick}
                            >
                                Start!
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        )
    }
}

export default Welcome;
