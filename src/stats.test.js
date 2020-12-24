import { chiSquaredPValue, multinomialPMF } from "./stats";

it('calculates chi squared p-value', () => {
    const data = [
        [0.02, 1, 0.887537],
        [0.21, 2, 0.900325],
        [0.58, 3, 0.900995],
        [3.84, 1, 0.050044],
        [5.99, 2, 0.050044],
        [7.81, 3, 0.050106],
        [13.2, 4, 0.010339],
        [16.92, 9, 0.049984],
        [16.92, 9, 0.049984],
        [200, 160, 0.017451],
    ];
    for (const [x2, df, p] of data) {
        expect(Math.abs(chiSquaredPValue(x2, df) - p)).toBeLessThan(0.01 * p);
    }
});

it('calculates multinomial probability mass function', () => {
    const data = [
        [[5, 5], 1/2, 0.24609],
        [[10, 0], 1/2, 0.00098],
        [[0, 10], 1/2, 0.00098],
        [[1, 9], 1/2, 0.00977],
        [[1, 9], [1/2, 1/2], 0.00977],
        [[5, 5, 0], 1/3, 0.00427],
        [[5, 0, 5], 1/3, 0.00427],
        [[7, 3, 0], 1/3, 0.00203],
    ];
    for (const [xs, ps, pmf] of data) {
        expect(multinomialPMF(xs, ps) - pmf).toBeLessThan(pmf * 0.01);
    }

});
