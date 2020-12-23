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
        let color = 'secondary';
        if (this.audio) {
            this.audio.volume = this.props.volume;
            this.audio.muted = this.props.muted;
           if (!this.audio.muted) {
               color = 'primary';
           }
            if (this.props.playing && this.audio.paused) {
                // Should be playing but is not, start playing
                console.log('Started playing', this.props.ix);
                this.audio.play();
            } else if (!this.props.playing) {
                // Should not be playing
                this.audio.pause();
                this.audio.currentTime = 0;
            }
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

export default CircleButton;
