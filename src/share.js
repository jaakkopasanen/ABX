import {bytesToBase64} from "./base64";
import {enrichAbStats, enrichAbxStats} from "./stats";

function createShareUrl(allTestStats, config) {
    const url = new URL(window.location.toString());
    if (url.searchParams.get('results')) {
        // Results already exists in URL, we came here from share link, no need to share again
        return null;
    }
    const configUrl = url.searchParams.get('test');
    const encodedResults = encodeTestResults(allTestStats, config);
    url.searchParams.delete('test');
    url.searchParams.set('results', encodedResults);
    url.searchParams.set('results', encodedResults);
    url.searchParams.set('test', configUrl);
    return url.toString();
}

/* eslint-disable */
function mulberry32(seed) {
    /* Pseudo random number generator factory
     * Use it like so
     *   const prng = mulberry32(seed);
     *   for (let i = 0; i < 5; ++i) {
     *     const x = prng();
     *   }
     */
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
/* eslint-enable */

function createObfuscationMask(seed, len, maxInt) {
    const prng = mulberry32(seed);
    const mask = [];
    for (let i = 0; i < len; ++i) {
        mask.push(Math.floor(prng() * (maxInt + 1)));
    }
    return mask;
}

function encodeTestResults(testResults, config) {
    // Map test names to ordinal numbers
    const testOrd = {};
    const testTypes = {};
    for (let i = 0; i < config.tests.length; ++i) {
        testOrd[config.tests[i].name] = i;
        testTypes[config.tests[i].name] = config.tests[i].testType;
    }

    // Map options to ordinal numbers
    const optionOrd = {};
    for (let i = 0; i < Object.keys(config.options).length; ++i) {
        optionOrd[config.options[i].name] = i;
    }

    // Create data array with ordinal numbers
    const obfuscatorSeed = Math.floor(Math.random() * 256);
    let data = [obfuscatorSeed];  // Add the obfuscator seed as the first byte
    for (const result of testResults) {
        // Add ordinal number of the test
        data.push(testOrd[result.name]);

        if (testTypes[result.name].toLowerCase() === 'ab') {
            for (const option of result.options) {
                // Add ordinal number of the selected option
                data.push(optionOrd[option.name]);
                // Add count
                data.push(option.count);
            }

        } else if (testTypes[result.name].toLowerCase() === 'abx') {
            for (const row of result.rows) {
                // Add ordinal number of the correct option
                data.push(optionOrd[row.correctOption]);
                // Add counts
                for (const name of Object.keys(row.counts)) {
                    // Add ordinal number of the selected option
                    data.push(optionOrd[name]);
                    // Add count of the selected option
                    data.push(row.counts[name]);
                }
            }
        } else {
            throw new Error(`Unsupported test type ${test.testType}`);
        }
    }

    data = Uint8Array.from(data);  // Make sure the data is bytes
    // Add random number in range 0..127 to each byte in the data arry
    // This assumes all values in the array are below 127, true if all of the tests have fewer than 127 iterations
    const obfuscationMask = createObfuscationMask(obfuscatorSeed, data.length - 1, 127);
    // Add obfuscation mask to the data bytes
    for (let i = 1; i < data.length; ++i) {
        data[i] += obfuscationMask[i - 1];
    }

    // Convert to URI component encoded Base64
    return encodeURIComponent(bytesToBase64(data));
}

function decodeTestResults(dataStr, config) {
    let data = decodeURIComponent(dataStr);
    data = Uint8Array.from(atob(data), c => c.charCodeAt(0));

    const obfuscatorSeed = data[0];  // Read the obfuscator seed from the first byte
    // Subtract obfusction mask from the data bytes
    const obfuscationMask = createObfuscationMask(obfuscatorSeed, data.length - 1, 127);
    for (let i = 1; i < data.length; ++i) {
        data[i] -= obfuscationMask[i - 1];
    }

    const testResults = [];
    let i = 1;  // Skip the obfuscator seed
    while (i < data.length) {
        const test = Object.assign({}, config.tests[data[i]]);

        if (test.testType.toLowerCase() === 'ab') {
            // Create AB stats objects with the count data
            const stats = {options: [], optionNames: []};
            for (let j = i + 1; j < i + 1 + test.options.length * 2; j += 2) {
                stats.options.push({
                    name: config.options[data[j]].name,
                    count: data[j + 1]
                });
                stats.optionNames.push(config.options[data[j]].name);
            }
            const enrichedStats = enrichAbStats(stats);
            // Add to test results
            testResults.push({
                name: test.name,
                testType: test.testType,
                optionNames: stats.optionNames.slice(),
                stats: enrichedStats
            });
            // Move index to the beginning of the next test in the data array
            i += 1 + test.options.length * 2;

        } else if (test.testType.toLowerCase() === 'abx') {
            // Create ABX stats objects with the row data
            const stats = {rows: [], optionNames: []};
            let ix = i + 1;  // Running index, starts from first byte after test indicator byte
            for (let j = 0; j < test.options.length; ++j) {
                // There's one row per option since data has been enriched
                const row = {correctOption: config.options[data[ix]].name, counts: {}};
                stats.optionNames.push(row.correctOption);
                ++ix;  // Move on to the first count pair byte
                for (let k = 0; k < test.options.length; ++k) {
                    // There's one byte pair per option since data has been enriched
                    // Read the selected option and it's count
                    row.counts[config.options[data[ix]].name] = data[ix + 1];
                    ix += 2;
                }
                stats.rows.push(row);
            }
            const enrichedStats = enrichAbxStats(stats);
            testResults.push({
                name: test.name,
                testType: test.testType,
                optionNames: stats.optionNames.slice(),
                stats: enrichedStats,
            })
            i = ix;  // Move i to the current running index

        } else {
            throw new Error(`Unsupported test type ${test.testType}`);
        }
    }
    return testResults;
}

export {createShareUrl, encodeTestResults, decodeTestResults};
