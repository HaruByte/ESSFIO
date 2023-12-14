/**
* No Windows here, madam.
* Go boot to Linux or use WSL.
* <br>
* Anyway, This is for creating new data file and generating frames from video file.
* All the anime video file must be in "animes" folder with format name "XX.{ mp4 | mkv }" where "XX" is number like "01".
*
* @file
* @author AozoraDev
*/
/** @module create */

const fs = require("fs");
const { program } = require("commander");
const { execSync } = require("child_process");

// Call the main function if called directly
if (require.main == module) {
    // Main
    program
        .name("create.js")
        .description("Create new data file and extract frames from video file.")
        .version(require("./package.json").version)
        .usage("[options] <episode (number)>");
    
    // Options
    program
        .option("-m, --max-episode <number>", "Using custom max episode instead")
        .option("-d, --enable-duplicate-detection", "Enable frame duplicate detection")
    
    program.parse(process.argv);
    const opts = program.opts();
    const episode = program.args[0];
    
    // Show help if episode arg not exist
    if (!episode) program.help();
    
    create(
        parseInt(episode),
        parseInt(opts.maxEpisode),
        opts.enableDuplicateDetection
    );
}

/**
 * Create new data.json and generate frames file from video file.
 * 
 * @param {number} episode - The episode to generate.
 * @param {?number} max_episode - Max episode for data.json
 * @param {?boolean} duplicate_detection - Enable duplicate detection
 * @throws {(Error|TypeError)}
 * @returns {Object} Output of data.json
 */
function create(episode, max_episode, duplicate_detection) {
    // For fancy console lol
    require("./utils/console.js");
    
    // Make sure the episode is a number
    if (isNaN(episode)) {
        throw new TypeError("The argument input is not a number.");
    }
    
    // Check the animes folder.
    if (!fs.existsSync("animes")) {
        throw new Error("\"animes\" folder is not exist.");
    }
    
    // Change the episode number to format XX.
    const episodePad = episode.toString().padStart(2, "0");
    
    // Folders handling
    if (fs.existsSync("frames")) {
        // If exist, delete all the files inside.
        console.log("Deleting all the existing frames...");
        
        const frames = fs.readdirSync("frames");
        if (frames) for (const fr of frames) {
            fs.unlinkSync("frames/" + fr);
        }
        
        console.log("All frame files are deleted!");
    } else {
        // If no, create new one
        console.log("\"frames\" folder not exist. Creating new one.")
        fs.mkdirSync("frames");
    }
    // Configs has nothing more to do.
    // Just create new folder if not exists
    if (!fs.existsSync("configs")) fs.mkdirSync("configs");
    
    // We have our private stuff in here so....
    if (fs.existsSync("create.private.sh")) {
        execSync(`bash create.private.sh ${episodePad}`);
        config(max_episode, duplicate_detection);
        return;
    }
    // But hey! I have the public one here.
    
    // Get the files inside "animes" folder
    const animes = fs.readdirSync("animes");
    // Filter only video with filename "XX.{ mp4 | mkv }"
    const anime = animes.filter(a => /\.(mp4|mkv)$/.test(a) && a.includes(episodePad))[0];
    
    // Check it again, just to make sure if the file is exist
    if (!anime) throw new Error("The video file is not found.");
    console.log(`Start creating data and frames for episode ${episodePad}...`);
    
    const args = [
        `-i "animes/${anime}"`, // Getting the video file
        "-r 2", // Make it 2FPS
        "-qscale:v 2", // So the frame file is not blurry
        `-vf "fps=2${(anime.includes(".mkv")) ? ",subtitles=animes/" + anime : ""}"`, // Also making the video 2fps but add subtitle filter if file is mkv
        "-hide_banner", // Hide the banner, i guess?
        "-loglevel error", // Uhm...
        "-stats", // Idk...
        "-y" // Yess
    ];
    console.log("Extracting frames...");
    execSync(`ffmpeg ${args.join(" ")} ./frames/${episodePad}_%04d.jpeg > /dev/null 2>&1`);
    
    // And then set up config then return the result
    return config(max_episode, duplicate_detection);
}

/**
 * Create a new data.json and then save it to "configs" folder
 * 
 * @private
 * @param {number=} max_episode - Max episode for data.json
 * @param {boolean=} duplicate_detection - Enable duplicate detection
 * @throws {Error}
 * @returns {Object} Output of data.json
 */
function config(max_episode, duplicate_detection) {
    const frames = fs.readdirSync("frames");
    const episode = frames[0].split("_")[0]; // The prefix of the file is the episode
    
    const configs = {
        current_episode: parseInt(episode),
        max_episode: max_episode || fs.readdirSync("animes").length,
        current_frame: 1,
        max_frame: frames.length,
        enable_duplicate_detection: duplicate_detection || false
    }
    
    // Write it to file
    fs.writeFileSync("configs/data.json", JSON.stringify(configs, null, 2));
    console.log("Creating data and frames successfully!");
    
    return configs;
}

module.exports = create;