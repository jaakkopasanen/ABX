import React from "react";
import Box from "@material-ui/core/Box";
import ABTest from "./ABTest";
import ThankYou from "./thankYou";
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

        this.results = Array(this.config.tests.length).fill(null);

        this.time = null;

        let volume = localStorage.getItem('volume');
        if (volume === null) {
            volume = 0.5;
        } else {
            volume = +volume;  // Cast to number
        }
        this.state = {
            volume:  volume,
            step: 0,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    handleSubmit(selectedOption) {
        this.results[this.state.step] = selectedOption;
        this.setState({step: this.state.step + 1})
        console.log(this.results);
    }

    handleVolumeChange(event, newValue) {
        this.setState({volume: newValue});
        const timer = Date.now();
        this.timer = timer;
        // Avoid updating local storage on each pixel movement
        setTimeout(() => {
            if (this.timer === timer) {
                console.log('set localStorage', this.state.volume);
                localStorage.setItem('volume', this.state.volume);
            }
        }, 1000);
    }

    render() {
        const steps = [];
        // TODO: iterations
        for (let i = 0; i < this.config.tests.length; ++i) {
            steps.push(
                <Box key={i} display={this.state.step === i ? 'flex' : 'none'}>
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
        steps.push(
            <Box key={steps.length} display={this.state.step === this.config.tests.length ? 'flex' : 'none'}>
                <ThankYou
                    title={this.config.thankYou.title}
                    description={this.config.thankYou.description}
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