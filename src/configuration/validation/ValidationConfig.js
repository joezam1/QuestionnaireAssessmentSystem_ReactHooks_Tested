const passwordMinCharacters = 3;
const passwordSaltRounds = 8;


const ValidationConfig = Object.freeze({
    passwordMinCharacters:passwordMinCharacters,
    passwordSaltRounds:passwordSaltRounds
});

module.exports = ValidationConfig;