import React from "react";
import Box from "@material-ui/core/Box";
import CircleButton from "./CircleButton";
import Typography from "@material-ui/core/Typography";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import LoopIcon from '@material-ui/icons/Loop';
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import shuffle from "./random";
import {Container, Divider, Paper} from "@material-ui/core";

class ABTest extends React.Component {
    constructor(props) {
        super(props);
        this.audio = [];
        this.audioStartTime = null;
        this.nSamples = null;
        this.state = {
            options: this.shuffleOptions(this.props.options),
            selected: null,
        };
        this.initAudio = this.initAudio.bind(this);
        this.stopAllAudio = this.stopAllAudio.bind(this);
        this.handleCursorChange = this.handleCursorChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.initAudio();
        this.initCursor();
    }

    shuffleOptions(options) {
        const ixs = shuffle([...Array(options.length).keys()])  // Randomly shuffled indexes
        return ixs.map(ix => options[ix])  // Shuffle options
    }

    createNode(url) {
        const node = new AudioBufferSourceNode(this.props.audioContext, {
            buffer: this.props.audioBuffers[url],
            loop: true,
            //loopStart: this.props.cursor[0] / this.props.audioContext.sampleRate,
            //loopEnd: this.props.cursor[1] / this.props.audioContext.sampleRate,
        });
        node.connect(this.props.audioDestination);
        return node;
    }

    initAudio() {
        for (const option of this.state.options) {
            if (this.nSamples === null) {
                this.nSamples = this.props.audioBuffers[option.audioUrl].length;
            } else if (this.props.audioBuffers[option.audioUrl].length !== this.nSamples) {
                throw Error('Audio tracks have different lengths')
            }
        }
        for (const option of this.state.options) {
            const audio = {
                url: option.audioUrl,
                node: this.createNode(option.audioUrl),
            };
            this.audio.push(audio);
        }
    }

    initCursor() {
        if (this.props.cursor === null) {
            // null gets passed from TestRunner to the first repeat of the test,
            // subsequent repeats use whatever what set or initialized in the first one
            this.props.onCursorChange(null, [0, this.nSamples]);
        }
    }

    stopAudio(ix) {
        try {
            // Stop audio, this is in try block because the audio might not have been started and attempting to stop
            // an audio which has not been started throws an InvalidStateError
            this.audio[ix].node.stop(0);
            // Create new AudioBufferSourceNode instance since these can be played only once
            this.audio[ix].node = this.createNode(this.audio[ix].url);
        } catch (error) {
            if (error.message !== 'AudioScheduledSourceNode.stop: Start has not been called on this AudioBufferSourceNode.') {
                throw error;
            }
        }
    }

    stopAllAudio() {
        for (let i = 0; i < this.audio.length; ++i) {
            this.stopAudio(i);
        }
        this.audioStartTime = null;
        this.setState({ selected: null });
    }

    startAudio(ix) {
        if (this.state.selected === null) {
            // Nothing playing, start from the beginning
            this.audio[ix].node.start(0, this.props.cursor[0] / this.props.audioContext.sampleRate);
            this.audioStartTime = this.props.audioContext.currentTime;
        } else {
            // Start different audio track from the current position
            const offset = (this.props.audioContext.currentTime - this.audioStartTime) % this.audio[ix].node.buffer.duration;
            this.audio[ix].node.start(0, offset);
        }
    }

    handleClick(ix) {
        if (this.state.selected === ix) {
            // Clicked the currently playing button, stop all
            this.stopAllAudio();

        } else {
            this.startAudio(ix);
            if (this.state.selected !== null) {
                this.stopAudio(this.state.selected);
            }
            this.setState({ selected: ix });
        }
    }

    handleCursorChange(event, newValue) {
        this.props.onCursorChange(event, newValue, () => {
            if (this.state.selected !== null) {
                this.stopAudio(this.state.selected);
                this.startAudio(this.state.selected);
            }
        })
    }

    handleSubmit() {
        if (this.state.selected === null) {
            return;
        }
        this.stopAllAudio();
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
                                <Box>
                                    <Box display="flex" flexDirection="row" p="10px">
                                        <LoopIcon style={{fontSize: 32, padding: '5px 0'}} />
                                        <Slider
                                            color="secondary"
                                            value={this.props.cursor}
                                            min={0} max={this.nSamples}
                                            step={Math.round(this.props.audioContext.sampleRate / 100)}
                                            onChange={this.handleCursorChange}
                                            className="volumeSlider"
                                        />
                                    </Box>
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