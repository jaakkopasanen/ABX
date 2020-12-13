import React from "react";
import Box from "@material-ui/core/Box";
import ABTest from "./ABTest";
import ThankYou from "./thankYou";

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

        this.state = {
            step: 0,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(selectedOption) {
        this.results[this.state.step] = selectedOption;
        this.setState({step: this.state.step + 1})
        console.log(this.results);
    }

    render() {
        const steps = [];
        // TODO: Global volume control?
        // TODO: nTests < length
        // TODO: testGroups
        // TODO: iterations
        for (let i = 0; i < this.config.tests.length; ++i) {
            steps.push(
                <Box key={i} display={this.state.step === i ? 'flex' : 'none'}>
                    <ABTest
                        title={this.config.tests[i].title}
                        description={this.config.tests[i].description}
                        options={this.config.tests[i].options}
                        onSubmit={this.handleSubmit}
                    />
                </Box>
            )
        }
        steps.push(
            <Box display={this.state.step === this.config.tests.length ? 'flex' : 'none'}>
                <ThankYou
                    title={this.config.thankYou.title}
                    description={this.config.thankYou.description}
                />
            </Box>
        )
        return (
            <Box display="flex" flexDirection="row" justifyContent="center">
                {steps}
            </Box>
        )
    }
}

export default TestRunner;