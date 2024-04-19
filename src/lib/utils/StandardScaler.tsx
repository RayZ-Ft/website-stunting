class StandardScaler {
    means: number[];
    stds: number[];

    constructor() {
        this.means = [];
        this.stds = [];
    }

    fit(data: [][]) {
        const numFeatures = data[0].length;
        const numSamples = data.length;

        this.means = new Array(numFeatures).fill(0);
        this.stds = new Array(numFeatures).fill(0);

        // Hitung rata-rata untuk setiap fitur
        for (let i = 0; i < numFeatures; i++) {
            let sum = 0;
            for (let j = 0; j < numSamples; j++) {
                sum += data[j][i];
            }
            this.means[i] = sum / numSamples;
        }

        // Hitung standar deviasi untuk setiap fitur
        for (let i = 0; i < numFeatures; i++) {
            let sumSquaredDiff = 0;
            for (let j = 0; j < numSamples; j++) {
                sumSquaredDiff += Math.pow(data[j][i] - this.means[i], 2);
            }
            this.stds[i] = Math.sqrt(sumSquaredDiff / numSamples);
        }
    }

    transform(data: [][]) {
        const numSamples = data.length;
        const numFeatures = data[0].length;
        const scaledData = [];

        for (let i = 0; i < numSamples; i++) {
            const scaledSample = [];
            for (let j = 0; j < numFeatures; j++) {
                const scaledValue = (data[i][j] - this.means[j]) / this.stds[j];
                scaledSample.push(scaledValue);
            }
            scaledData.push(scaledSample);
        }

        return scaledData;
    }

    fitTransform(data: [][]) {
        this.fit(data);
        return this.transform(data);
    }
}

export default StandardScaler;