/**
 * Generates a sensible temporary password for new users.
 * Pattern: [First3OfName]@[Year][Random4Digits]
 * 
 * @param {string} name Full name of the user
 * @returns {string} temporary password
 */
const generateRandomPassword = (name = "User") => {
    const year = new Date().getFullYear();

    // Extract first 3 letters of first name, sanitized
    const firstName = name ? name.split(' ')[0].replace(/[^a-zA-Z]/g, '') : "User";
    const prefix = (firstName.length >= 3 ? firstName.slice(0, 3) : firstName.padEnd(3, 'x'));
    const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();

    // 4 random digits for non-guessability across same-batch users
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    return `${formattedPrefix}@${year}${randomSuffix}`;
};

export default generateRandomPassword;
