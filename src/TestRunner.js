import React from "react";
import Box from "@material-ui/core/Box";
import Welcome from "./Welcome";
import ABTest from "./ABTest";
import Results from "./Results";
import Container from "@material-ui/core/Container";
import { abStats} from "./stats";

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
                    userSelections: [],
                    optionNames: test.options.map(option => option.name),
                    nOptions: test.options.length,
                }))
            });
        });
    }

    async parseConfig(inConfig) {
        return this.fetchConfig(inConfig).then(config => {
            const audio = {};
            for (const [name, obj] of Object.entries(config.options)) {
                // Make URLs downloadable link and create Audio objects
                if (typeof obj === 'string') {
                    config.options[name] = {
                        url: this.rawLink(obj),
                        tag: obj.tag
                    };
                } else {
                    config.options[name].url = this.rawLink(obj.url);
                }
                audio[config.options[name].url] = new Audio(config.options[name].url);
                audio[config.options[name].url].muted = true;
                audio[config.options[name].url].loop = true;
                audio[config.options[name].url].volume = this.state.volume;
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
                        url: config.options[name].url,
                        audio: audio[config.options[name].url],
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
        const dropboxPattern = new RegExp('^(https?://)?(www\.)?dropbox.com');
        if (dropboxPattern.test(urlStr)) {
            let url = new URL(urlStr);
            url.searchParams.delete('dl');
            url.host = url.host.replace(dropboxPattern, 'dl.dropboxusercontent.com')
            return url.toString();
        }
        return urlStr;
    }

    start(form) {
        this.setState({
            testStep: 0,
            form: Object.assign({}, form)
        });
    }

    next(selectedOption) {
        /* Moving to next test iteration
        * Args:
        *   selectedOption: Option object by user selection. See componentDidMount() for structure.
        * */
        for (const audio of Object.values(this.audio)) {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = true;
        }

        let results = JSON.parse(JSON.stringify(this.state.results));
        results[this.state.testStep].userSelections.push(selectedOption);

        if (this.state.repeatStep + 1 === this.config.tests[this.state.testStep].repeat) {
            // Last repeat
            if (this.state.testStep + 1 === this.config.tests.length && this.config.email) {
                // Last test, submit results if email is given in the config
                const testResults = results.map(result => {
                    let stats;
                    if (result.testType.toLowerCase() === 'ab') {
                        stats = abStats(result.name, result.optionNames, result.userSelections);
                        delete stats.optionNames;
                    } else {
                        throw `Unsupported test type ${result.testType}`
                    }
                    return {
                        name: result.name,
                        testType: result.testType,
                        optionNames: result.optionNames,
                        userSelections: result.userSelections.map(selection => selection.name),
                        stats: stats
                    };
                });
                fetch('/submit', {
                    method: 'POST',
                    cache: 'no-cache',
                    credentials: 'omit',
                    headers: {'Content-Type': 'application/json'},
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify({
                        name: this.config.name,
                        form: this.state.form,
                        testResults: testResults,
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
                            stepStr={`${j + 1}/${this.config.tests[i].repeat}`}
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
