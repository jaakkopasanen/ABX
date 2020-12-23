import React from 'react';
import ReactDOM from 'react-dom';
import TestRunner from "./TestRunner";
import './index.css';

// https://www.dropboxforum.com/t5/Dropbox-files-folders/public-links-to-raw-files/td-p/110391
const config = {
    welcome: {
        title: 'EQ Reqularization AB Test',
        description: 'Series of ABC listening tests for equalizer regularization',
    },
    thankYou: {
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
        repeat: 10
    }, {
        type: 'AB',
        title: 'AB Test 2',
        description: 'Select the most preferred option',
        options: ['Tibetan Bells', 'Tolling Bell'],
    }]
};



ReactDOM.render(
    <TestRunner className="test" config={config} />,
    document.getElementById('root')
);
