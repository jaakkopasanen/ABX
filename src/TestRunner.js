import React from "react";
import Box from "@material-ui/core/Box";
import ABTest from "./ABTest";
import ThankYou from "./ThankYou";
import Container from "@material-ui/core/Container";

class TestRunner extends React.Component {
    constructor(props) {
        super(props);

        if (typeof(props.config) === 'string') {
            // Download JSON file
            this.config = null;
        } else {
            this.config = Object.assign({}, props.config)
        }
        for (let i = 0; i < this.config.tests.length; ++i) {
            if (this.config.tests[i].repeat === null) {
                // Repeat defaults to 1
                this.config.tests[i].repeat = 1;
            }
        }

        let volume = localStorage.getItem('volume');
        if (volume === null) {
            volume = 0.5;
        } else {
            volume = +volume;  // Cast to number
        }
        this.state = {
            volume:  volume,
            timer: null,
            testStep: 0,
            repeatStep: 0,
            results: Array(this.config.tests.length).fill([]),
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    handleSubmit(selectedOption) {
        let results = JSON.parse(JSON.stringify(this.state.results));
        results[this.state.testStep].push(selectedOption);
        console.log('Copied results');
        console.log(results);

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
        const steps = [];
        // TODO: iterations
        console.log('TestRunner.state.results');
        console.log(this.state.results);
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
            <Container maxWidth="xs">
                {steps}
            </Container>
        )
    }
}

export default TestRunner;