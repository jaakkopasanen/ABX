import React from "react";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";

const CircleButton = withStyles((theme) => ({
    root: {
        borderRadius: '50%',
        maxWidth: '48px',
        minWidth: '48px',
        height: '48px',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
    },
}))(Button);

class AudioButton extends React.Component {
    constructor(props) {
        super(props);
        this.audio = new Audio(this.props.url);
        this.audio.muted = true;
        this.audio.loop = true;
    }

    getChar() {
        const A = 'A'.charCodeAt(0);
        return String.fromCharCode(A + this.props.ix)
    }

    render() {
        let color;
        let disableElevation = false;
        if (this.audio) {
            this.audio.volume = this.props.volume;
            this.audio.muted = this.props.muted;
            if (this.props.playing && !this.audio.playing) {
                this.audio.play();
                color = this.audio.muted ? 'secondary' : 'primary';
                disableElevation = !this.audio.muted;
            } else if (!this.props.playing) {
                this.audio.pause();
                this.audio.currentTime = 0;
                color = 'secondary';
                disableElevation = false;
            }

        } else {
            color = 'secondary'
            disableElevation = false;
        }
        return (
            <CircleButton
                variant="contained"
                color={color}
                size="large"
                onClick={this.props.onClick}
                m={1}
                disableElevation={disableElevation}
            >
                {this.getChar()}
            </CircleButton>
        );
    }
}

export default AudioButton;
