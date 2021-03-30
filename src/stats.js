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

function multinomialPMF(xs, ps) {
    if (typeof ps === 'number') {
        // Single number given, create array full of it
        ps = Array(xs.length).fill(ps);
    }
    if (!Array.isArray(ps)) {
        // Something else than array or a number given
        throw new Error('ps must be an array of a number');
    }
    if (ps.reduce((a, b) => a + b, 0) !== 1.0) {
        // Probabilities don't sum up to 1.0
        throw new Error('ps must sum to 1.0');
    }
    const n = xs.reduce((a, b) => a + b, 0);
    let denom = 1.0;
    for (const x of xs) {
        denom = denom * factorial(x);
    }
    let prob = 1.0;
    for (let i = 0; i < ps.length; ++i) {
        prob = prob * Math.pow(ps[i], xs[i]);
    }
    return factorial(n) / denom * prob;
}

function abStats(name, optionNames, usersSelections) {
    const stats = {
        name: name,
        options: [],
        nOptions: optionNames.length,
        optionNames: optionNames.slice(),
        totalCount: usersSelections.length
    };

    // Iterate through user's selections
    for (let j = 0; j < usersSelections.length; ++j) {
        // Find the option with the name of the current selection
        const option = stats.options.filter(option => option.name === usersSelections[j].name);
        if (option.length) {
            // Found, increment count
            ++option[0].count;
        } else {
            // Doesn't exist, create new
            stats.options.push({
                name: usersSelections[j].name,
                count: 1,
            });
        }
    }

    // Add options which were never selected with zero counts
    for (let name of stats.optionNames) {
        if (!stats.options.map(option => option.name).includes(name)) {
            stats.options.push({
                name: name,
                count: 0
            });
        }
    }
    for (let option of stats.options) {
        option.percentage = option.count / stats.totalCount * 100;
    }

    // Sort by counts
    stats.options.sort((a, b) => b.count - a.count);

    // Calculate p-value
    stats.pValue = multinomialPMF(stats.options.map(option => option.count), 1 / stats.nOptions);

    return stats;
}

export { chiSquaredPValue, multinomialPMF, abStats };
