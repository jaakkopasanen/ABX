import React from 'react';
import ReactDOM from 'react-dom';
import TestRunner from "./TestRunner";
import './index.css';

// https://www.dropboxforum.com/t5/Dropbox-files-folders/public-links-to-raw-files/td-p/110391
const config = {
    welcome: {
        description: '#### EQ Regularization AB Test\n\n' +
            'You will go through a series of ABC listening tests. There\'s 3 tests in total and each has ' +
            '20 iterations. In each test you must choose the option which sounds best to you. The option you have ' +
            'selected when moving forward will be your answer. At the end you will see your results.\n\n' +
            'Your results will be submitted to [abxtest.app](https://abxtest.app) website along with the details ' +
            'you\'ve given in the form below. The information in the form will be used for acquiring statistics ' +
            'about the different demographics and are completely anonymous.',
        form: [{
            name: 'Age',
            type: 'number'
        }, {
            name: 'Gender',
            type: 'select',
            options: ['Female', 'Male', 'Other']
        }, {
            name: 'Experience',
            type: 'select',
            options: ['Trained listener', 'Audio engineer', 'Audio retailer', 'Audio reviewer',
                'Self-proclaimed audiophile', 'Musician', 'None of the above']
        }]
    },
    results: {
        title: 'Thank you for participating!',
        description: 'Your results have been submitted.'
    },
    options: {
        'Tibetan Bells': 'https://www.dropbox.com/s/wjsrxo46abwzvkx/bells-tibetan-daniel_simon.wav?dl=0',
        'Tolling Bell': 'https://www.dropbox.com/s/jo4qol1fkl5j0x7/tolling-bell_daniel-simion.wav?dl=0',
        'Cartoon Birds': 'https://www.dropbox.com/s/w3r33kl2c0ee3op/cartoon-birds-2_daniel-simion.wav?dl=0',
    },
    tests: [{
        type: 'AB',  // ABX, Triangle, rating, ranking, MUSHRA, seek
        title: 'AB Test 1',
        description: 'Select the most preferred option',
        options: ['Tibetan Bells', 'Tolling Bell', 'Cartoon Birds'],
        repeat: 3,
    }, {
        type: 'AB',
        title: 'AB Test 2',
        description: 'Select the most preferred option',
        options: ['Tibetan Bells', 'Tolling Bell'],
        repeat: 3,
    }]
};
//const config = new URL(window.location.toString()).searchParams.get('test');

ReactDOM.render(
    <TestRunner className="test" config={config} />,
    document.getElementById('root')
);
