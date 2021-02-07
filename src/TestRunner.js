import React from "react";
import Box from "@material-ui/core/Box";
import Welcome from "./Welcome";
import ABTest from "./ABTest";
import Results from "./Results";
import Container from "@material-ui/core/Container";

class TestRunner extends React.Component {
    constructor(props) {
        super(props);

        this.config = null;
        this.audio = {};
        let volume = localStorage.getItem('volume');
        volume = volume === null ? 0.5 : +volume;
        this.state = {
            form: {},
            volume:  volume,
            timer: null,
            testStep: -1,
            repeatStep: 0,
            results: [],
        };

        this.start = this.start.bind(this);
        this.next = this.next.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleAudioButtonClick = this.handleAudioButtonClick.bind(this);
    }

    componentDidMount() {
        this.parseConfig(this.props.config).then(configAndAudio => {
            this.config = configAndAudio.config;
            this.audio = configAndAudio.audio;
            this.setState({
                results: this.config.tests.map(test => ({
                    name: test.title,
                    testType: test.type,
                    choices: [],
                    optionNames: test.options.map(option => option.name),
                    nOptions: test.options.length,
                }))
            });
        });
    }

    async parseConfig(inConfig) {
        return this.fetchConfig(inConfig).then(config => {
            const audio = {};
            // Convert links to downloadable links
            for (const [key, val] of Object.entries(config.options)) {
                config.options[key] = this.rawLink(val);
                audio[config.options[key]] = new Audio(config.options[key]);
                audio[config.options[key]].muted = true;
                audio[config.options[key]].loop = true;
                audio[config.options[key]].volume = this.state.volume;
            }
            for (let i = 0; i < config.tests.length; ++i) {
                // Repeat defaults to 1
                if (!config.tests[i].repeat) {
                    config.tests[i].repeat = 1;
                }
                // Create option objects by querying the options with the given names
                config.tests[i].options = config.tests[i].options.map((name) => {
                    return {
                        name: name,
                        url: config.options[name],
                        audio: audio[config.options[name]],
                    }
                });
            }
            return {config: config, audio: audio};
        });
    }

    async fetchConfig(config) {
        if (typeof(config) === 'string') {
            // Download JSON file
            const url = this.rawLink(config);
            return await fetch(url).then(res => res.json());
        } else {
            return Object.assign({}, config);
        }
    }

    rawLink(urlStr) {
        let url = new URL(urlStr);
        if (url.host.includes('dropbox.com')) {
            url.searchParams.delete('dl');
            url.host = url.host.replace('www.', 'dl.')
                .replace('dropbox.com', 'dropboxusercontent.com');
        }
        return url.toString();
    }

    start(form) {
        this.setState({
            testStep: 0,
            form: Object.assign({}, form)
        });
    }

    next(selectedOption) {
        for (const audio of Object.values(this.audio)) {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = true;
        }

        let results = JSON.parse(JSON.stringify(this.state.results));
        results[this.state.testStep].choices.push(selectedOption);

        if (this.state.repeatStep + 1 === this.config.tests[this.state.testStep].repeat) {
            // Last repeat
            if (this.state.testStep + 1 === this.config.tests.length && this.config.email) {
                // Last test, submit results if email is given in the config
                fetch('/submit', {
                    method: 'POST',
                    cache: 'no-cache',
                    credentials: 'omit',
                    headers: {'Content-Type': 'application/json'},
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify({
                        form: this.state.form,
                        testResults: results.map(result => {
                            return {
                                name: result.name,
                                testType: result.testType,
                                choices: result.choices.map(choice => choice.name),
                                optionNames: result.optionNames,
                            };
                        }),
                        email: this.config.email,
                    })
                });
            }
            // Move to the next test
            this.setState({
                testStep: this.state.testStep + 1,
                repeatStep: 0,
                results: results,
            })

        } else {
            // Repeat test
            this.setState({
                repeatStep: this.state.repeatStep + 1,
                results: results,
            })
        }
    }

    handleVolumeChange(event, newValue) {
        for (const audio of Object.values(this.audio)) {
            audio.volume = newValue;
        }
        const timer = Date.now();
        this.setState({
            volume: newValue,
            timer: timer
        });
        // Avoid updating local storage on each pixel movement
        setTimeout(() => {
            if (this.state.timer === timer) {
                localStorage.setItem('volume', this.state.volume);
            }
        }, 1000);
    }

    handleAudioButtonClick(selectedUrl) {
        // TODO: Add 5-100 ms of silence to mitigate the 0-2 ms difference in start times?
        if (this.audio[selectedUrl].paused) {
            // Nothing playing right now
            for (const [url, audio] of Object.entries(this.audio)) {
                audio.muted = !(url === selectedUrl);
                audio.play();
            }
        } else if (this.audio[selectedUrl].muted) {
            // Clicked different button than what is currently playing
            for (const [url, audio] of Object.entries(this.audio)) {
                audio.muted = !(url === selectedUrl);
            }
        } else {
            // Clicked the currently playing button, stop all
            for (const audio of Object.values(this.audio)) {
                audio.muted = true;
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }

    render() {
        if (!this.config) {
            return "";
        }
        const steps = [];

        if ('welcome' in this.config) {
            // Add welcome screen
            steps.push(
                <Box key={'welcome'} display={this.state.testStep === -1 ? 'flex' : 'none'}>
                    <Welcome
                        description={this.config.welcome.description}
                        form={this.config.welcome.form}
                        onClick={this.start}
                    />
                </Box>
            )
        }

        // Add tests
        for (let i = 0; i < this.config.tests.length; ++i) {
            for (let j = 0; j < this.config.tests[i].repeat; ++j) {
                steps.push(
                    <Box
                        key={`${i}.${j}`}
                        display={this.state.testStep === i  && this.state.repeatStep === j ? 'flex' : 'none'}
                    >
                        <ABTest
                            title={this.config.tests[i].title}
                            description={this.config.tests[i].description}
                            options={this.config.tests[i].options}
                            onSubmit={this.next}
                            volume={this.state.volume}
                            onVolumeChange={this.handleVolumeChange}
                            onClick={this.handleAudioButtonClick}
                        />
                    </Box>
                )
            }
        }

        // Add results screen
        steps.push(
            <Box key={steps.length} display={this.state.testStep === this.config.tests.length ? 'flex' : 'none'}>
                <Results
                    title={this.config.results.title}
                    description={this.config.results.description}
                    results={this.state.results}
                />
            </Box>
        )
        return (
            <Container maxWidth="sm">
                {steps}
            </Container>
        )
    }
}

export default TestRunner;