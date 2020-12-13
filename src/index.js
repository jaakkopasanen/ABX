import React from 'react';
import ReactDOM from 'react-dom';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import './index.css';

const A = 'A'.charCodeAt(0);

// https://www.dropboxforum.com/t5/Dropbox-files-folders/public-links-to-raw-files/td-p/110391
const config = {
    title: 'AB Test',
    description: 'Select the most preferred option',
    options: [
        'https://dl.dropbox.com/s/wjsrxo46abwzvkx/bells-tibetan-daniel_simon.wav',
        'https://dl.dropbox.com/s/jo4qol1fkl5j0x7/tolling-bell_daniel-simion.wav',
        'https://dl.dropbox.com/s/w3r33kl2c0ee3op/cartoon-birds-2_daniel-simion.wav'
    ]
};

class AudioButton extends React.Component {
    constructor(props) {
        super(props);
        this.audio = null
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.audio = new Audio(this.props.url);
        this.audio.muted = true;
        this.audio.loop = true;
    }

    getChar() {
        return String.fromCharCode(A + this.props.ix)
    }

    handleClick() {
        this.props.onClick(this.getChar());
    }

    render() {
        let color;
        if (this.audio) {
            this.audio.volume = this.props.volume;
            this.audio.muted = this.props.muted;
            if (this.props.playing && !this.audio.playing) {
                this.audio.play();
            }
            color = this.audio.muted ? 'secondary' : 'primary'
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

class ABTest extends React.Component {
    constructor(props) {
        super(props);
        const volume = localStorage.getItem('volume') || 0.5;
        this.state = {
            selected: null,
            volume: volume,
            muted: Array(this.props.nOptions).fill(true),
            playing: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    handleClick(i) {
        const muted = Array(this.props.nOptions).fill(true);
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

    render() {
        const audioButtons = [];
        for (let i = 0; i < config.options.length; ++i) {
            audioButtons.push(
                <Box key={i} mx="8px">
                    <AudioButton
                        ix={i}
                        url={config.options[i]}
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
                    <Box><Typography variant="h1">{config.title}</Typography></Box>
                    <Box><Typography>{config.description}</Typography></Box>
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
                        <Button variant="outlined" color="secondary">Next</Button>
                    </Box>
                </Box>
            </Box>

        );
    }
}

class Test extends React.Component {
    render() {
        let testInstance;
        if (this.props.type.toLowerCase() === 'ab') {
            testInstance = <ABTest nOptions={this.props.nOptions} />;
        }
        return testInstance;
    }
}

ReactDOM.render(
    <Test type="ab" nOptions={3} className="test" />,
    document.getElementById('root')
);
