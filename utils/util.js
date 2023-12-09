/**
 * @file
 * This is utility for handling some stuff that
 * the program need to works properly.
 * 
 * @author AozoraDev
 */
/** @module utils/util */

const fs = require("fs");
const { HashAlgorithm, hammingDistance } = require("img-hasher");

/**
 * Add pad to number like XXXX or XX or idk...
 * 
 * @param {number} number - Input number to add pad
 * @param {number} pad - How many pad on the number
 * @returns {string} Number with pad
 */
function addNumberPad(number, pad) {
    return number
        .toString()
        .padStart(pad, "0");
}

/**
 * Detect duplication between two images by using hashing.
 * Mean Algorithm is used in this hashing
 *
 * @async
 * @param {string} file1 - Path to the first file
 * @param {string} file2 - Path to the second file
 * @returns {Promise<boolean>} true if duplication is detected, false if not duplication.
 */
async function detectDuplicate(file1, file2) {
    const distance = await hammingDistance(
        fs.readFileSync(file1),
        fs.readFileSync(file2),
        HashAlgorithm.Mean
    );
    
    return (distance == 0); // 0 means there's a duplication detected
}

/**
 * Upload a image to ShareX server with output format jpeg
 * 
 * @async
 * @param {string} path - Path to the image file
 * @param {string=} fileName - File name for the image file
 * @returns {Promise<string>} URL to the uploaded image file
 * @throws {Error}
 */
async function uploadImage(path, fileName) {
    const sxcu = JSON.parse(fs.readFileSync(process.cwd() + "/configs/uploader.sxcu", { encoding: "utf8" }));
    const file = fs.readFileSync(path);
    const sxcuData = new FormData();
    
    sxcuData.append(sxcu.FileFormName, new Blob([file]), fileName || "file.jpeg");
    if (sxcu.Arguments) for (const prop in sxcu.Arguments) {
        sxcuData.append(prop, sxcu.Arguments[prop]);
    }
    
    // Upload frame file to ShareX server
    const res = await fetch(sxcu.RequestURL, {
        method: sxcu.RequestMethod || "POST",
        body: sxcuData
    }).then(r => r.json());
    
    // The fetch should throw error, but this one is just in case.
    if (!res.url) throw new Error("URL output is not exist");
    
    return res.url + ".jpeg";
}

module.exports = {
    addNumberPad,
    detectDuplicate,
    uploadImage
}