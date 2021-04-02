import React from "react";
import Box from "@material-ui/core/Box";
import CircleButton from "./CircleButton";
import Typography from "@material-ui/core/Typography";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import { Divider, Paper } from "@material-ui/core";
import ABTest from "./ABTest";

class ABXTest extends ABTest {
    constructor(props) {
        super(props);
        const options = this.state.options.slice();
        options.push({
            name: 'X',
            audioUrl: options[Math.floor(Math.random() * options.length)].audioUrl,
        });
        this.state = {
            ...this.state,
            options: options
        };
        this.silence = 20;
    }

    handleSubmit() {
        if (this.state.selected === null || this.state.selected === this.state.options.length - 1) {
            // Refusing to submit if nothing is selected or if X is selected
            return;
        }
        this.stopAudio();
        this.props.onSubmit(
            // Selected option
            Object.assign({}, this.state.options[this.state.selected]),
            Object.assign({}, this.state.options.find(
                // Find the option which has the same audio URL as the X (which is the last one in the array)
                option => option.audioUrl === this.state.options[this.state.options.length - 1].audioUrl
            ))
        );
    }

    getChar(ix) {
        if (ix === this.state.options.length - 1) {
            // X is the last one
            return 'X';
        }
        const A = 'A'.charCodeAt(0);
        return String.fromCharCode(A + ix);
    }

    render() {
        const audioButtons = [];
        for (let i = 0; i < this.state.options.length; ++i) {
            const coordinates = this.circleCoordinates(i, this.state.options.length, 64, 24);
            let color = null;
            if (i === this.state.options.length - 1) {
                // X
                color = this.state.selected === i ? 'primary' : 'default';
            } else {
                color = this.state.selected === i ? 'primary' : 'secondary';
            }
            audioButtons.push(
                <Box key={i} style={{
                    position: "absolute",
                    top: coordinates.top,
                    left: coordinates.left,
                }}>
                    <CircleButton
                        onClick={() => this.handleClick(i)}
                        variant="contained"
                        color={color}
                        size="large"
                    >
                        {this.getChar(i)}
                    </CircleButton>
                </Box>
            )
        }
        return (
            <Box display="flex" flexDirection="column" className="width100p" mt="16px">
                <Box>
                    <Paper>
                        <Box p="20px">
                            <Box mt="12px" mb="40px">
                                <Typography variant="h4" className="centerText">
                                    {this.props.name}
                                </Typography>
                                {this.props.description &&
                                <Box mt={2}>
                                    <Typography className="centerText">
                                        {this.props.description}
                                    </Typography>
                                </Box>}
                            </Box>
                            <Box>
                                <Divider />
                            </Box>
                            <Box display="flex" flexDirection="row" justifyContent="end" mt="6px" mr="8px">
                                <Typography color="textSecondary">{this.props.stepStr}</Typography>
                            </Box>
                            <Box>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="center"
                                    className="audioButtonGroup"
                                >
                                    {audioButtons}
                                </Box>
                                <Box display="flex" flexDirection="row" justifyContent="flex-end" mt="16px">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={this.handleSubmit}
                                        disabled={this.state.selected === null || this.state.selected === this.state.options.length - 1}
                                    >
                                        {`Select ${this.getChar(this.state.selected)}`}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <Box mt="10px">
                    <Paper className="paperPadding">
                        <Box display="flex" flexDirection="row" p="10px">
                            <VolumeUpIcon style={{fontSize: 32, padding: '5px 0'}} />
                            <Slider
                                color="secondary"
                                value={this.props.volume}
                                defaultValue={0.5}
                                min={0.0} max={1.0} step={0.01}
                                onChange={this.props.onVolumeChange}
                                className="volumeSlider"
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        );
    }
}

export default ABXTest;