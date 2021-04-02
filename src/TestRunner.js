import React from "react";
import Box from "@material-ui/core/Box";
import Welcome from "./Welcome";
import ABTest from "./ABTest";
import Results from "./Results";
import Container from "@material-ui/core/Container";
import {abStats, tagStats} from "./stats";
import { parseConfig} from "./config";

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
        parseConfig(this.props.config).then(config => {
            this.config = Object.assign({}, config);
            this.audio = {};
            for (let i = 0; i < this.config.options.length; ++i) {
                // Create audio object and identify it with the audio URL
                this.audio[this.config.options[i].audioUrl] = new Audio(this.config.options[i].audioUrl);
                this.audio[this.config.options[i].audioUrl].muted = true;
                this.audio[this.config.options[i].audioUrl].loop = true;
                this.audio[this.config.options[i].audioUrl].volume = this.state.volume;
                this.config.options[i].audio = this.audio[this.config.options[i].audioUrl];
            }

            this.setState({
                results: this.config.tests.map(test => ({
                    name: test.name,
                    testType: test.testType,
                    userSelections: [],
                    optionNames: test.options.map(option => option.name),
                    nOptions: test.options.length,
                }))
            });
        });
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
        let option = Object.assign({}, selectedOption);
        delete option.audio;
        results[this.state.testStep].userSelections.push(option);

        if (this.state.repeatStep + 1 === this.config.tests[this.state.testStep].repeat) {
            // Last repeat
            if (this.state.testStep + 1 === this.config.tests.length && this.config.email) {
                // Last test, submit results if email is given in the config
                const testResults = results.map(result => {
                    let stats;
                    if (result.testType.toLowerCase() === 'ab') {
                        stats = abStats(result.name, result.optionNames, result.userSelections);
                        delete stats.optionNames;
                        delete stats.name;
                    } else {
                        throw new Error(`Unsupported test type ${result.testType}`)
                    }
                    return {
                        name: result.name,
                        testType: result.testType,
                        optionNames: result.optionNames,
                        userSelections: result.userSelections.map(selection => selection.name),
                        stats: stats
                    };
                });
                let tagSts = tagStats(results, this.config);
                if (tagSts) {
                    tagSts = tagSts.stats;
                }
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
                        tagStats: tagSts,
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

        // Add tests
        for (let i = 0; i < this.config.tests.length; ++i) {
            for (let j = 0; j < this.config.tests[i].repeat; ++j) {
                steps.push(
                    <Box
                        key={`${i}.${j}`}
                        display={this.state.testStep === i  && this.state.repeatStep === j ? 'flex' : 'none'}
                    >
                        <ABTest
                            name={this.config.tests[i].name}
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
                    description={this.config.results ? this.config.results.description : ''}
                    results={this.state.results}
                    config={this.config}
                />
            </Box>
        )
        return (
            <Box className="greyBg">
                <Container maxWidth="sm">
                    {steps}
                </Container>
            </Box>
        )
    }
}

export default TestRunner;
