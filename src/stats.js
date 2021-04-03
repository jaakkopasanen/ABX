function LogGamma(Z) {
    var S = 1 + 76.18009173 / Z - 86.50532033 / (Z + 1) + 24.01409822 / (Z + 2) - 1.231739516 / (Z + 3) + .00120858003 / (Z + 4) - .00000536382 / (Z + 5);
    return (Z - .5) * Math.log(Z + 4.5) - (Z + 4.5) + Math.log(S * 2.50662827465);
}

function Gcf(X, A) {        // Good for X>A+1
    var A0 = 0;
    var B0 = 1;
    var A1 = 1;
    var B1 = X;
    var AOLD = 0;
    var N = 0;
    while (Math.abs((A1 - AOLD) / A1) > .00001) {
        AOLD = A1;
        N = N + 1;
        A0 = A1 + (N - A) * A0;
        B0 = B1 + (N - A) * B0;
        A1 = X * A0 + N * A1;
        B1 = X * B0 + N * B1;
        A0 = A0 / B1;
        B0 = B0 / B1;
        A1 = A1 / B1;
        B1 = 1;
    }
    var Prob = Math.exp(A * Math.log(X) - X - LogGamma(A)) * A1;
    return 1 - Prob;
}

function Gser(X, A) {        // Good for X<A+1.
    var T9 = 1 / A;
    var G = T9;
    var I = 1;
    while (T9 > G * .00001) {
        T9 = T9 * X / (A + I);
        G = G + T9;
        I = I + 1;
    }
    G = G * Math.exp(A * Math.log(X) - X - LogGamma(A));
    return G
}

function Gammacdf(x, a) {
    var GI;
    if (x <= 0) {
        GI = 0
    } else if (x < a + 1) {
        GI = Gser(x, a)
    } else {
        GI = Gcf(x, a)
    }
    return GI
}

function chiSquaredPValue(x, df) {
    if (df <= 0) {
        alert("Degrees of freedom must be positive")
        return;
    }
    const Chisqcdf = Gammacdf(x / 2, df / 2)
    return 1 - Math.round(Chisqcdf * 100000) / 100000;
}

function factorial(num) {
    let rval=1;
    for (let i = 2; i <= num; i++) {
        rval = rval * i;
    }
    return rval;
}

function multinomialPMF(counts, probabilities) {
    /* Calculated multinomial probability with probability mass function
     * Args:
     *   xs: counts of choices
     *   ps: probabilities of choices
     */
    if (typeof probabilities === 'number') {
        // Single number given, create array full of it
        probabilities = Array(counts.length).fill(probabilities);
    }
    if (!Array.isArray(probabilities)) {
        // Something else than array or a number given
        throw new Error('ps must be an array of a number');
    }
    if (Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1.0) > 1e-5) {
        // Probabilities don't sum up to 1.0
        throw new Error(`ps must sum to 1.0 but is ${Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1.0)}`);
    }
    const n = counts.reduce((a, b) => a + b, 0);
    let denom = 1.0;
    for (const x of counts) {
        denom = denom * factorial(x);
    }
    let prob = 1.0;
    for (let i = 0; i < probabilities.length; ++i) {
        prob = prob * Math.pow(probabilities[i], counts[i]);
    }
    return factorial(n) / denom * prob;
}

function enrichAbStats(stats) {
    const enrichedStats = Object.assign({}, stats);

    // Add options which were never selected with zero counts
    for (const name of stats.optionNames) {
        if (!stats.options.map(option => option.name).includes(name)) {
            enrichedStats.options.push({
                name: name,
                count: 0
            });
        }
    }

    // Calculate percentages
    enrichedStats.totalCount = stats.options.reduce((sum, b) => sum + b.count, 0);
    for (let i = 0; i < enrichedStats.options.length; ++i) {
        enrichedStats.options[i].percentage = enrichedStats.options[i].count / enrichedStats.totalCount * 100;
    }

    // Sort by counts
    enrichedStats.options.sort((a, b) => b.count - a.count);

    // Calculate p-value
    enrichedStats.nOptions = enrichedStats.optionNames.length;
    enrichedStats.pValue = multinomialPMF(
        enrichedStats.options.map(option => option.count),
        1 / enrichedStats.nOptions
    );

    return enrichedStats;
}

function computeAbStats(name, optionNames, userSelections) {
    const stats = {
        name: name,
        options: [],
        nOptions: optionNames.length,
        optionNames: optionNames.slice()
    };

    // Iterate through user's selections
    for (let i = 0; i < userSelections.length; ++i) {
        // Find the option with the name of the current selection
        const option = stats.options.find(option => option.name === userSelections[i].name);
        if (option) {
            // Found, increment count
            ++option.count;
        } else {
            // Doesn't exist, create new
            stats.options.push({
                name: userSelections[i].name,
                count: 1,
            });
        }
    }

    return enrichAbStats(stats);
}

function enrichAbxStats(stats) {
    const enrichedStats = Object.assign({}, stats);

    // Add rows for options which were never the correct option
    for (const name of enrichedStats.optionNames) {
        if (!enrichedStats.rows.find(row => row.correctOption === name)) {
            enrichedStats.rows.push({
                correctOption: name,
                counts: {}
            })
        }
    }

    // Add zeros counts for missing options in rows
    for (let i = 0; i < enrichedStats.rows.length; ++i) {
        for (const name of enrichedStats.optionNames) {
            if (enrichedStats.rows[i].counts[name] === undefined) {
                enrichedStats.rows[i].counts[name] = 0;
            }
        }
    }

    // Calculate p-value
    enrichedStats.correctCount = 0;
    enrichedStats.incorrectCount = 0;
    for (const row of enrichedStats.rows) {
        // Add the count of the correct option to the correct counter
        enrichedStats.correctCount += row.counts[row.correctOption];
        // Add the counts of the incorrect options to the incorrect counter
        for (const [name, count] of Object.entries(row.counts)) {
            if (name !== row.correctOption) {
                // Name doesn't match the correct option, this was incorrect selection
                enrichedStats.incorrectCount += count;
            }
        }
    }

    // Calculate p-value
    enrichedStats.nOptions = enrichedStats.optionNames.length;
    enrichedStats.pValue = multinomialPMF(
        [enrichedStats.correctCount, enrichedStats.incorrectCount],
        [1 / enrichedStats.nOptions, 1 - 1 / enrichedStats.nOptions]
    );

    return enrichedStats;
}

function computeAbxStats(name, optionNames, userSelectionsAndCorrects) {
    /* Calculates ABX statistics
    * Args:
    *   name: Name of the test
    *   optionNames: Array of options' names included in the test
    *   userSelectionsAndCorrects: Array of objects with selectedOption and correctOption
    */
    const stats = {
        name: name,
        rows:[],
        nOptions: optionNames.length,
        optionNames: optionNames.slice()
    }

    for (let i = 0; i < userSelectionsAndCorrects.length; ++i) {
        const selectedName = userSelectionsAndCorrects[i].selectedOption.name;
        const correctName = userSelectionsAndCorrects[i].correctOption.name;
        //const option = stats.options.filter(option => option.name === userSelectionsAndCorrects[i].name);
        let row = stats.rows.find(row => row.correctOption === correctName);
        if (!row) {
            // Doesn't exist, create new
            row = {
                correctOption: correctName,
                counts: {}  // Fill with zeros
            }
            stats.rows.push(row);
        }
        if (!row.counts[selectedName]) {
            row.counts[selectedName] = 0;
        }
        ++row.counts[selectedName];
    }
    // Sort rows and optionNames alphabetically
    stats.rows.sort((a, b) => (a.correctOption < b.correctOption ? -1 : 1));
    stats.optionNames.sort((a, b) => (a.correctOption < b.correctOption ? -1 : 1));
    return enrichAbxStats(stats);
}

function computeAbTagStats(allTestStats, config) {
    // Create lookup table to get tags with option names
    const optionsToTags = {};
    for (const option of config.options) {
        optionsToTags[option.name] = option.tag;
    }

    const allTagStats = [];
    for (const testStats of allTestStats) {  // Stats for a single AB test
        // Get all tags of the options in this test, uniques and sorted
        const tags = [...new Set(testStats.options.map(option => optionsToTags[option.name]))];
        if (tags.length < 2) continue;  // One is not a group
        tags.sort();
        // Form tag group name by joining the individual tags with " vs "
        const tagGroupName = tags.join(' vs ');
        // Check if a tag group with the same name already exists
        let tagGroup = allTagStats.find(tagGroupStats => tagGroupStats.name === tagGroupName);
        if (tagGroup) {
            // Tag group with the same name exists, update counts
            for (const testStatsOption of testStats.options) {
                const tag = optionsToTags[testStatsOption.name];
                const tagGroupOption = tagGroup.options.find(tagGroupOption => tagGroupOption.name === tag);
                // Option exists because all options are created when the group is created, increase count
                tagGroupOption.count += testStatsOption.count;
            }
        } else {
            // Tag group with the same name doesn't exist, create new
            tagGroup = {
                name: tagGroupName,
                options: tags.map(tag => ({
                    name: tag,
                    count: 0
                })),
                nOptions: tags.length,
                optionNames: tags
            };
            for (const testStatsOption of testStats.options) {
                // Find correct option in the options to preserve the order of the tags
                const tag = optionsToTags[testStatsOption.name];
                const tagGroupOption = tagGroup.options.find(tagGroupOption => tagGroupOption.name === tag);
                // Option exists because all options were just created in the initialization, increase count
                tagGroupOption.count += testStatsOption.count;
            }
            allTagStats.push(tagGroup);
        }
    }
    return allTagStats.map(tagStats => enrichAbStats(tagStats));
}

function computeAbxTagStats(allTestStats, config) {
    // Create lookup table to get tags with option names
    const optionsToTags = {};
    for (const option of config.options) {
        optionsToTags[option.name] = option.tag;
    }

    const allTagStats = [];
    for (const testStats of allTestStats) {  // Stats for a single ABX test
        // testStats: name, rows, nOptions, optionNames
        // row: correctOption, counts: selectedOption, count
        // Get all tags of the options in this test, uniques and sorted
        const tags = [...new Set(testStats.rows.map(row => optionsToTags[row.correctOption]))];
        if (tags.length < 2) continue;  // One is not a group
        tags.sort();
        // Form tag group name by joining the individual tags with " vs "
        const tagGroupName = tags.join(' vs ');
        // Check if a tag group with the same name already exists
        let tagGroup = allTagStats.find(tagGroupStats => tagGroupStats.name === tagGroupName);
        if (!tagGroup) {
            // Tag group with the same name doesn't exist, create new
            tagGroup = {
                name: tagGroupName,
                rows: tags.map(tag => {
                    // Initialize all row counts with zeros
                    const counts = {};
                    for (const tag of tags) {
                        counts[tag] = 0;
                    }
                    return {
                        correctOption: tag,
                        counts: counts
                    };
                }),
                nOptions: tags.length,
                optionNames: tags
            };
            allTagStats.push(tagGroup);
        }
        // Increase all counts ain all rows
        for (const testStatsRow of testStats.rows) {
            // Find the row with the test stats row's correct option
            const tag = optionsToTags[testStatsRow.correctOption];
            const tagGroupRow = tagGroup.rows.find(tagGroupRow => tagGroupRow.correctOption === tag)
            for (const [selectedOption, count] of Object.entries(testStatsRow.counts)) {
                tagGroupRow.counts[optionsToTags[selectedOption]] += count;
            }
        }
    }
    return allTagStats.map(tagStats => enrichAbxStats(tagStats));
}

export { chiSquaredPValue, multinomialPMF, computeAbStats, computeAbxStats, enrichAbStats, enrichAbxStats, computeAbTagStats, computeAbxTagStats };
