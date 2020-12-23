import React from "react";
import Box from "@material-ui/core/Box";
import ABTest from "./ABTest";
import ThankYou from "./ThankYou";
import Container from "@material-ui/core/Container";

class TestRunner extends React.Component {
    constructor(props) {
        super(props);

        this.config = null;
        let volume = localStorage.getItem('volume');
        volume = volume === null ? 0.5 : +volume;
        this.state = {
            volume:  volume,
            timer: null,
            testStep: 0,
            repeatStep: 0,
            results: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    componentDidMount() {
        this.parseConfig(this.props.config).then(config => {
            console.log('componentDidMount');
            console.log(config);
            this.config = config;
            this.setState({
                results: config.tests.map(test => ({
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
            // Convert links to downloadable links
            for (const [key, val] of Object.entries(config.options)) {
                config.options[key] = this.rawLink(val);
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
                        url: config.options[name]
                    }
                });
            }
            return config;
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

    handleSubmit(selectedOption) {
        let results = JSON.parse(JSON.stringify(this.state.results));
        results[this.state.testStep].choices.push(selectedOption);

        if (this.state.repeatStep + 1 === this.config.tests[this.state.testStep].repeat) {
            // Last repeat, move to next test
            this.setState({
                testStep: this.state.testStep + 1,
                repeatStep: 0,
                results: results,
            })
        } else {
            this.setState({
                repeatStep: this.state.repeatStep + 1,
                results: results,
            })
        }
    }

    handleVolumeChange(event, newValue) {
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
                            onSubmit={this.handleSubmit}
                            volume={this.state.volume}
                            onVolumeChange={this.handleVolumeChange}
                        />
                    </Box>
                )
            }
        }
        steps.push(
            <Box key={steps.length} display={this.state.testStep === this.config.tests.length ? 'flex' : 'none'}>
                <ThankYou
                    title={this.config.thankYou.title}
                    description={this.config.thankYou.description}
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