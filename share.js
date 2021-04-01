const fs = require('fs');
const yaml = require('js-yaml');
const atob = require('atob');

function encodeTestResults(testResults, config) {
    // Map test names to ordinal numbers
    const testOrd = {};
    for (let i = 0; i < config.tests.length; ++i) {
        testOrd[config.tests[i].title] = i;
    }
    // Map options to ordinal numbers
    const optionOrd = {};
    for (let i = 0; i < Object.keys(config.options).length; ++i) {
        optionOrd[Object.keys(config.options)[i]] = i;
    }
    // Create data array with ordinal numbers
    const data = [];
    for (const result of testResults) {
        data.push(testOrd[result.name]);
        for (const option of result.stats.options) {
            data.push(optionOrd[option.name]);
            data.push(option.count);
        }
    }
    // Convert to URI component encoded Base64
    return encodeURIComponent(Buffer.from(data).toString('base64'));
}

function decodeTestResults(dataStr, config) {
    const options = Object.keys(config.options).map(name => config.options[name]);
    let data = decodeURIComponent(dataStr);
    data = Uint8Array.from(atob(data), c => c.charCodeAt(0));

    const testResults = [];
    let i = 0;
    while (i < data.length) {
        const test = Object.assign({}, config.tests[data[i]]);
        const stats = {options: []};
        for (let j = i + 1; j < i + 1 + test.options.length * 2; j += 2) {
            stats.options.push({
                name: options[data[j]],
                count: data[j + 1]
            });
        }
        i += 1 + test.options.length * 2;
        testResults.push({
            name: test.title,
            testType: test.testType,
            optionNames: test.options,
            stats: stats
        });
    }
    return testResults;
}

const config = yaml.load(fs.readFileSync('public/demo.yml'));
const results = JSON.parse(fs.readFileSync('mp3-vs-lossless 2021-03-30 13 45 10 UTC.json'));
const dataStr = encodeTestResults(results.testResults, config);
console.log('encoded:', dataStr);
const decoded = decodeTestResults(dataStr, config);
console.log('decoded:', JSON.stringify(decoded, undefined, 4));
