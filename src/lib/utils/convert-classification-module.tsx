function convertClassificationNutritionalStatusToNumber(classification: string) {
    switch (classification) {
        case "normal":
            return 0;
        case "tinggi":
            return 1;
        case "severely stunted":
            return 2;
        case "stunted":
            return 3;
        default:
            throw new Error('Klasifikasi tidak terdaftar dalam data');
    }
}

function convertGenderToNumber(gender: string) {
    switch (gender) {
        case "perempuan":
            return 0;
        case "laki-laki":
            return 1;
        default:
            throw new Error(`Klasifikasi tidak terdaftar dalam data ${gender}`)
    }
}

export {
    convertClassificationNutritionalStatusToNumber,
    convertGenderToNumber
};