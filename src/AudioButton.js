import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

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
        if (this.audio) {
            this.audio.volume = this.props.volume;
            this.audio.muted = this.props.muted;
            if (this.props.playing && !this.audio.playing) {
                this.audio.play();
                color = this.audio.muted ? 'secondary' : 'primary'
            } else if (!this.props.playing) {
                this.audio.pause();
                this.audio.currentTime = 0;
                color = 'secondary';
            }

        } else {
            color = 'secondary'
        }
        return (
            <Box>
                <Button
                    variant="contained"
                    color={color}
                    size="large"
                    onClick={this.props.onClick}
                    m={1}
                >
                    {this.getChar()}
                </Button>
            </Box>

        );
    }
}

export default AudioButton;
