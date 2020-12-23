import React from "react";
import Box from "@material-ui/core/Box";
import AudioButton from "./AudioButton";
import Typography from "@material-ui/core/Typography";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import shuffle from "./random";
import { getChar } from "./utils";
import { Divider, Paper } from "@material-ui/core";

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
        this.props.onSubmit(this.state.options[this.state.selected]);
    }

    circleCoordindates(i, n, r) {
        let alpha0;
        switch (n) {
            case 3:
                alpha0 = Math.PI / 2 + Math.PI * 2 / 3 / 2
                break;
            case 5:
                alpha0 = Math.PI / 2 + Math.PI * 2 / 5
                break;
            default:
                alpha0 = Math.PI;
        }
        const top = 'calc(50% - ' + Math.sin(alpha0 - Math.PI * 2 / n * i) * r + 'px)';
        const left = 'calc(50% + ' + Math.cos(alpha0 - Math.PI * 2 / n * i) * r + 'px)';
        return {
            top: top,
            left: left
        }
    }

    render() {
        const audioButtons = [];
        for (let i = 0; i < this.state.options.length; ++i) {
            const n = this.state.options.length;
            const r = Math.max(1, n / 5) * 50;
            const coordinates = this.circleCoordindates(i, n, r);

            audioButtons.push(
                <div key={i} style={{
                    position: "absolute",
                    top: coordinates.top,
                    left: coordinates.left,
                }}>
                    <AudioButton
                        ix={i}
                        url={this.state.options[i].url}
                        volume={this.props.volume}
                        muted={this.state.muted[i]}
                        playing={this.state.playing}
                        onClick={() => this.handleClick(i)}
                    />
                </div>
            )
        }
        return (
                <Box display="flex" flexDirection="column" className="width100p" mt="16px">
                    <Paper>
                        <Box p="20px">
                            <Box mt="12px" mb="32px">
                                <Typography variant="h2" className="centerText">{this.props.title || ''}</Typography>
                                <Typography className="centerText">{this.props.description || ''}</Typography>
                            </Box>
                            <Box>
                                <Divider />
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
                                <Box display="flex" flexDirection="row" justifyContent="end" mt="16px">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={this.handleSubmit}
                                        disabled={!this.state.playing}
                                    >
                                        {`Select ${getChar(this.state.selected)}`}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                    <Box mt="16px">
                        <Paper className="paperPadding">
                            <Box display="flex" flexDirection="row" p="10px">
                                <VolumeUpIcon style={{fontSize: 42}} />
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

export default ABTest;