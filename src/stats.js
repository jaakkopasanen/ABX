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

function chdtr(x, df) {
    if (df <= 0) {
        alert("Degrees of freedom must be positive")
        return;
    }
    const Chisqcdf = Gammacdf(x / 2, df / 2)
    return Math.round(Chisqcdf * 100000) / 100000;
}

export default chdtr;