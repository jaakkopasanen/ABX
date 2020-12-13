import React from 'react';
import ReactDOM from 'react-dom';
import Box from "@material-ui/core/Box";
import './index.css';
import ABTest from "./ABTest";
import ThankYou from "./thankYou";

// https://www.dropboxforum.com/t5/Dropbox-files-folders/public-links-to-raw-files/td-p/110391
const config = {
    title: 'EQ Reqularization AB Test',
    description: 'Series of ABC listening tests for equalizer regularization',
    thankYou: {
        title: 'Thank you for participating!',
        description: 'Your results have been submitted.'
    },
    tests: [{
        type: 'AB',
        title: 'AB Test',
        description: 'Select the most preferred option',
        options: [
            'https://dl.dropbox.com/s/wjsrxo46abwzvkx/bells-tibetan-daniel_simon.wav',
            'https://dl.dropbox.com/s/jo4qol1fkl5j0x7/tolling-bell_daniel-simion.wav',
            'https://dl.dropbox.com/s/w3r33kl2c0ee3op/cartoon-birds-2_daniel-simion.wav'
        ]
    }, {
        type: 'AB',
        title: 'AB Test 2',
        description: 'Select the most preferred option',
        options: [
            'https://dl.dropbox.com/s/wjsrxo46abwzvkx/bells-tibetan-daniel_simon.wav',
            'https://dl.dropbox.com/s/jo4qol1fkl5j0x7/tolling-bell_daniel-simion.wav',
            //'https://dl.dropbox.com/s/w3r33kl2c0ee3op/cartoon-birds-2_daniel-simion.wav'
        ]
    }]
};

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

ReactDOM.render(
    <TestRunner className="test" config={config} />,
    document.getElementById('root')
);
