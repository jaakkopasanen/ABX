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
        const ixs = shuffle([...Array(this.props.options.length).keys()])
        this.state = {
            options: ixs.map((ix) => this.props.options[ix]),  // Shuffle options
            selected: null,
            muted: Array(this.props.options.length).fill(true),
            playing: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClick(i) {
        if (this.state.playing && i === this.state.selected) {
            // Clicked the already selected button, stop playing
            this.setState({
                selected: null,
                muted: Array(this.state.options.length).fill(true),
                playing: false,
            });
            return;
        }
        const muted = Array(this.state.options.length).fill(true);
        muted[i] = false;
        this.setState({
            selected: i,
            muted: muted,
            playing: true,
        });
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
        for (let i = 0; i < this.state.options.length; ++i) {
            audioButtons.push(
                <Box key={i} mx="8px">
                    <AudioButton
                        ix={i}
                        url={this.state.options[i]}
                        volume={this.props.volume}
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
                    <Box display="flex" flexDirection="row" justifyContent="center" mt="16px">{audioButtons}</Box>
                    <Box display="flex" flexDirection="row" mt="24px">
                        <VolumeUpIcon style={{fontSize: 28}} />
                        <Slider
                            color="secondary"
                            value={this.props.volume}
                            defaultValue={0.5}
                            min={0.0} max={1.0} step={0.01}
                            onChange={this.props.onVolumeChange}
                        />
                    </Box>
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