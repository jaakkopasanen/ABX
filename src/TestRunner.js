import React from "react";
import Box from "@material-ui/core/Box";
import Welcome from "./Welcome";
import ABTest from "./ABTest";
import Results from "./Results";
import Container from "@material-ui/core/Container";
import {computeAbStats, computeAbTagStats, computeAbxStats, computeAbxTagStats} from "./stats";
import { parseConfig} from "./config";
import ABXTest from "./ABXTest";
import {createShareUrl} from "./share";

class TestRunner extends React.Component {
    constructor(props) {
        super(props);

        this.config = null;
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
        this.nextStep = this.nextStep.bind(this);
        this.handleAbTestSubmit = this.handleAbTestSubmit.bind(this);
        this.handleAbxTestSubmit = this.handleAbxTestSubmit.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    componentDidMount() {
        parseConfig(this.props.config).then(config => {
            this.config = Object.assign({}, config);
            this.setState({
                results: this.config.tests.map(test => {
                    const result = {
                        name: test.name,
                        testType: test.testType,
                        optionNames: test.options.map(option => option.name),
                        nOptions: test.options.length,
                    };
                    if (test.testType.toLowerCase() === 'ab') {
                        result.userSelections = [];
                    } else if (test.testType.toLowerCase() === 'abx') {
                        result.userSelectionsAndCorrects = [];
                    }
                    return result;
                })
            });
        });
    }

    start(form) {
        this.setState({
            testStep: 0,
            form: Object.assign({}, form)
        });
    }

    submitResults(allTestResults) {
        // Last test, submit results if email is given in the config
        const abStats = [];
        const abxStats = [];
        for (const results of allTestResults) {
            if (results.testType.toLowerCase() === 'ab') {
                abStats.push(computeAbStats(results.name, results.optionNames, results.userSelections));
            } else if (results.testType.toLowerCase() === 'abx') {
                abxStats.push(computeAbxStats(results.name, results.optionNames, results.userSelectionsAndCorrects));
            } else {
                throw new Error(`Unsupported test type ${results.testType}`)
            }
        }
        const abTagStats = computeAbTagStats(abStats, this.config);
        const abxTagStats = computeAbxTagStats(abxStats, this.config);
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
                testResults: abStats.concat(abxStats),
                tagStats: abTagStats.concat(abxTagStats),
                shareUrl: createShareUrl(abStats.concat(abxStats), this.config),
                email: this.config.email,
            })
        });
    }

    nextStep(results) {
        /* Moves on to the next step which is next iteration, next test or results */
        if (this.state.repeatStep + 1 === this.config.tests[this.state.testStep].repeat) {
            // Last repeat of the test
            if (this.state.testStep + 1 === this.config.tests.length && this.config.email) {
                // Last test, submit results
                this.submitResults(results);
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

    handleAbTestSubmit(selectedOption) {
        /* Moving to next test iteration
        * Args:
        *   selectedOption: Option object by user selection. See componentDidMount() for structure.
        * */
        let results = JSON.parse(JSON.stringify(this.state.results));
        let option = Object.assign({}, selectedOption);
        delete option.audio;
        results[this.state.testStep].userSelections.push(option);
        this.nextStep(results);
    }

    handleAbxTestSubmit(selectedOption, correctOption) {
        /* Moving to next test iteration
        * Args:
        *   selectedOption: Option object by user selection. See componentDidMount() for structure.
        * */
        let results = JSON.parse(JSON.stringify(this.state.results));
        let option = Object.assign({}, selectedOption);
        delete option.audio;
        results[this.state.testStep].userSelectionsAndCorrects.push({
            selectedOption: option,
            correctOption: correctOption
        });
        this.nextStep(results);
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
                let component = null;
                if (this.config.tests[i].testType.toLowerCase() === 'ab') {
                    component = (<ABTest
                        name={this.config.tests[i].name}
                        description={this.config.tests[i].description}
                        stepStr={`${j + 1}/${this.config.tests[i].repeat}`}
                        options={this.config.tests[i].options}
                        onSubmit={this.handleAbTestSubmit}
                        volume={this.state.volume}
                        onVolumeChange={this.handleVolumeChange}
                        onClick={this.handleAudioButtonClick}
                    />)
                } else if (this.config.tests[i].testType.toLowerCase() === 'abx') {
                    component = (<ABXTest
                        name={this.config.tests[i].name}
                        description={this.config.tests[i].description}
                        stepStr={`${j + 1}/${this.config.tests[i].repeat}`}
                        options={this.config.tests[i].options}
                        onSubmit={this.handleAbxTestSubmit}
                        volume={this.state.volume}
                        onVolumeChange={this.handleVolumeChange}
                        onClick={this.handleAudioButtonClick}
                    />)
                } else {
                    throw new Error(`Usupported test type ${this.config.tests[i].testType}`)
                }
                steps.push(
                    <Box
                        key={`${i}.${j}`}
                        display={this.state.testStep === i  && this.state.repeatStep === j ? 'flex' : 'none'}
                    >
                        {component}
                    </Box>
                )
            }
        }

        // Add results screen
        steps.push(
            <Box
                key={steps.length}
                display={this.state.testStep === this.config.tests.length ? 'flex' : 'none'}
                className="greyBg"
                pt={2} pb={2}
            >
                <Container maxWidth="sm">
                    <Results
                        description={this.config.results ? this.config.results.description : ''}
                        results={this.state.results}
                        config={this.config}
                    />
                </Container>
            </Box>
        )
        return (
            <Box>
                {steps}
            </Box>
        )
    }
}

export default TestRunner;
