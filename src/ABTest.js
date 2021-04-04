import React from "react";
import Box from "@material-ui/core/Box";
import CircleButton from "./CircleButton";
import Typography from "@material-ui/core/Typography";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import shuffle from "./random";
import {Container, Divider, Paper} from "@material-ui/core";

class ABTest extends React.Component {
    constructor(props) {
        super(props);
        const ixs = shuffle([...Array(this.props.options.length).keys()])  // Randomly shuffled indexes
        this.audio = [];
        this.state = {
            options: ixs.map(ix => this.props.options[ix]),  // Shuffle options
            selected: null,
        };
        this.stopAudio = this.stopAudio.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        for (const option of this.state.options) {
            const audio = new Audio(option.audioUrl);
            //audio.muted = true;
            audio.loop = true;
            audio.volume = this.props.volume;
            this.audio.push(audio);
        }
    }

    stopAudio() {
        for (let i = 0; i < this.audio.length; ++i) {
            //this.audio[i].muted = true;
            this.audio[i].pause();
            this.audio[i].currentTime = 0;
        }
        this.setState({selected: null});
    }

    handleClick(ix) {
        if (this.state.selected === ix) {
            // Clicked the currently playing button, stop all
            this.stopAudio();

        } else {
            let currentTime = 0;
            if (this.state.selected !== null) {
                // Pause the currently playing one
                this.audio[this.state.selected].pause();
                currentTime = this.audio[this.state.selected].currentTime + 0.1;
            }
            this.audio[ix].currentTime = currentTime;
            this.audio[ix].play();
            this.setState({selected: ix});
        }
    }

    handleSubmit() {
        if (this.state.selected === null) {
            return;
        }
        this.stopAudio();
        this.props.onSubmit(this.state.options[this.state.selected]);
    }

    getChar(ix) {
        const A = 'A'.charCodeAt(0);
        return String.fromCharCode(A + ix);
    }

    circleCoordinates(i, nButtons, buttonDiameter, buttonSpacing) {
        let alpha0;
        switch (nButtons) {
            case 3:
                alpha0 = Math.PI / 2 + Math.PI * 2 / 3 / 2
                break;
            case 5:
                alpha0 = Math.PI / 2 + Math.PI * 2 / 5
                break;
            default:
                alpha0 = Math.PI;
        }
        const r = ((buttonSpacing + buttonDiameter) / 2) / Math.sin(Math.PI / nButtons);
        const top = 'calc(50% - ' + Math.sin(alpha0 - Math.PI * 2 / nButtons * i) * r + 'px)';
        const left = 'calc(50% + ' + Math.cos(alpha0 - Math.PI * 2 / nButtons * i) * r + 'px)';
        return {
            top: top,
            left: left
        }
    }

    render() {
        // Set volumes
        for (const audio of Object.values(this.audio)) {
            audio.volume = this.props.volume;
        }
        const audioButtons = [];
        for (let i = 0; i < this.state.options.length; ++i) {
            const coordinates = this.circleCoordinates(i, this.state.options.length, 64, 24);
            audioButtons.push(
                <CircleButton
                    key={i}
                    onClick={() => this.handleClick(i)}
                    variant="contained"
                    color={this.state.selected === i ? 'primary' : 'secondary'}
                    diameter={64}
                    top={coordinates.top}
                    left={coordinates.left}
                >
                    {this.getChar(i)}
                </CircleButton>
            )
        }
        return (
            <Box className="greyBg" pt={2} pb={2}>
                <Container maxWidth="sm">
                    <Box display="flex" flexDirection="column">
                        <Box>
                            <Paper>
                                <Box p="20px">
                                    <Box mb="40px">
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
                                                disabled={this.state.selected === null}
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
                </Container>
            </Box>
        );
    }
}

export default ABTest;