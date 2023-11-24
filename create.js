/*
* No Windows here, madam.
* Go boot to Linux or use WSL.
*
* Anyway, This is for creating new data file and frames.
* All the anime video file must be in "animes" folder with format name "XX.{ mp4 | mkv }".
*/

require("./utils/console.js");
const fs = require("fs");
const { execSync } = require("child_process");

// Call the main function if called directly
if (require.main == module) {
    // The second argument here is the episode number.
    if (process.argv[2]) {
        create(parseInt(process.argv[2]));
    } else {
        create();
    }
}

function create(episode = 1) {
    // Check if episode is number.
    if (typeof episode != "number") {
        throw new TypeError("episode is not a number.");
    }
    // And check the animes folder too.
    if (!fs.existsSync("animes")) {
        console.log("\"animes\" folder not exist. Exiting...")
        process.exit(1);
    }
    
    // Change the episode number to format XX.
    const episodePad = episode.toString().padStart(2, "0");
    
    // Folders handling
    if (fs.existsSync("frames")) {
        // If exist, delete all the files inside.
        console.log("Deleting all the frame files...");
        
        const frames = fs.readdirSync("frames");
        if (frames) for (const fr of frames) {
            fs.unlinkSync("frames/" + fr);
        }
        
        console.log("All frame files are deleted!");
    } else {
        // If no, create new one
        console.log("\"frame\" folder not exist. Creating new one.")
        fs.mkdirSync("frames");
    }
    // Configs has nothing more to do.
    // Just create new folder if not exists
    if (!fs.existsSync("configs")) fs.mkdirSync("configs");
    
    try {
        // We have our private stuff in here so....
        if (fs.existsSync("create.private.sh")) {
            execSync(`bash create.private.sh ${episodePad}`);
            config(12);
            return;
        }
        // But hey! I have the public one here.
        
        // Get the files inside "animes" folder
        const animes = fs.readdirSync("animes");
        // Filter only video with filename "XX.{ mp4 | mkv }"
        const anime = animes.filter(a => /\.(mp4|mkv)$/.test(a) && a.includes(episodePad))[0];
        
        // Check it again, just to make sure if the file is exist
        if (!anime) throw new Error("Video file is not found!");
        
        console.log(`Start creating data and frames for episode ${episodePad}...`);
        // Extract the frames.
        // Gotta use jpeg for this since png really fucked up the storage
        console.log("Extracting frames...");
        
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
        execSync(`ffmpeg ${args.join(" ")} ./frames/${episodePad}_%04d.jpeg > /dev/null 2>&1`);
        
        // And then set up config
        config();
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Need to kill so that index.js doesnt continue shit.
    }
}

function config(max_episode) {
    if (max_episode && typeof max_episode != "number") {
        throw new TypeError("max_episode is not a number.");
    }
    
    const frames = fs.readdirSync("frames");
    const animes = fs.readdirSync("animes");
    const episode = frames[0].split("_")[0];
    
    const configs = {
        current_episode: parseInt(episode),
        max_episode: max_episode || animes.length,
        current_frame: 1,
        max_frame: frames.length
    }
    
    // Write it to file
    fs.writeFileSync("configs/data.json", JSON.stringify(configs, null, 2));
    console.log("Creating data and frames successfully!");
}

module.exports = create;