import React from "react";
import Box from "@material-ui/core/Box";
import AudioButton from "./AudioButton";
import Typography from "@material-ui/core/Typography";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import shuffle from "./random";

class ABTest extends React.Component {
    constructor(props) {
        super(props);
        const volume = localStorage.getItem('volume') || 0.5;
        this.ixs = shuffle([...Array(this.props.options.length).keys()])
        this.options = this.ixs.map((ix) => this.props.options[ix])
        this.state = {
            selected: null,
            volume: volume,
            muted: Array(this.options.length).fill(true),
            playing: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClick(i) {
        const muted = Array(this.options.length).fill(true);
        muted[i] = false;
        this.setState({
            selected: i,
            muted: muted,
            playing: true,
        });
    }

    handleVolumeChange(event, newValue) {
        localStorage.setItem('volume', newValue);
        this.setState({volume: newValue});
    }

    handleSubmit() {
        if (!this.state.playing) {
            return;
        }
        this.setState({playing: false});
        this.props.onSubmit(this.options[this.state.selected]);
    }

    render() {
        const audioButtons = [];
        for (let i = 0; i < this.options.length; ++i) {
            audioButtons.push(
                <Box key={i} mx="8px">
                    <AudioButton
                        ix={i}
                        url={this.options[i]}
                        volume={this.state.volume}
                        muted={this.state.muted[i]}
                        playing={this.state.playing}
                        onClick={() => this.handleClick(i)}
                    />
                </Box>
            )
        }
        return (
            <Box display="flex" flexDirection="row" justifyContent="center">
                <Box display="flex" flexDirection="column" width="400px">
                    <Box><Typography variant="h1">{this.props.title}</Typography></Box>
                    <Box><Typography>{this.props.description}</Typography></Box>
                    <Box display="flex" flexDirection="row" mt="24px">
                        <VolumeUpIcon style={{fontSize: 28}} />
                        <Slider
                            color="secondary"
                            value={this.state.volume}
                            defaultValue={0.5}
                            min={0.0} max={1.0} step={0.01}
                            onChange={this.handleVolumeChange}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" justifyContent="center" mt="16px">{audioButtons}</Box>
                    <Box display="flex" flexDirection="row" justifyContent="end" mt="16px">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.handleSubmit}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </Box>

        );
    }
}

export default ABTest;