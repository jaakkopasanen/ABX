import React from "react";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";
import { getChar } from "./utils";

const size = 64;

const CircleButton = withStyles((theme) => ({
    root: {
        borderRadius: '50%',
        maxWidth: size,
        minWidth: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: 24
    },
}))(Button);

class AudioButton extends React.Component {
    constructor(props) {
        super(props);
        this.audio = new Audio(this.props.url);
        this.audio.muted = true;
        this.audio.loop = true;
    }

    render() {
        let color;
        if (this.audio) {
            this.audio.volume = this.props.volume;
            this.audio.muted = this.props.muted;
            if (this.props.playing && !this.audio.playing) {
                this.audio.play();
                color = this.audio.muted ? 'secondary' : 'primary';
            } else if (!this.props.playing) {
                this.audio.pause();
                this.audio.currentTime = 0;
                color = 'secondary';
            }

        } else {
            color = 'secondary'
        }
        return (
            <CircleButton
                variant="contained"
                color={color}
                size="large"
                onClick={this.props.onClick}
                m={1}
            >
                {getChar(this.props.ix)}
            </CircleButton>
        );
    }
}

export default AudioButton;
