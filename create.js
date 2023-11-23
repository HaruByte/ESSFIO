/*
* No Windows here, madam.
* Go boot to Linux or use WSL.
*
* Anyway, This is for creating new data file and frames.
* All the anime video file must be in "animes" folder with format name "XX.{ mp4 | mkv }".
*/

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
        console.error("Invalid parameter. Exiting...")
        process.exit(1);
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
        console.log("\"frames\" folder already exist. Deleting all the frame files...");
        
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
            execSync(`bash create.private.sh ${episodePad} > /dev/null 2>&1`);
            config();
            return;
        }
        // But hey! I have the public one here.
        
        // Get the anime file first
        const anime = fs.readdirSync("animes")
        .filter(a => /\.(mp4|mkv)$/.test(a) && a.includes(episodePad))[0]; // Filter only video with exact episode and format
        // Check it again, just to make sure if the file is exist
        if (!anime) throw new Error("Video file is not found!");
        console.log(`Start creating episode ${episodePad}...`);
        
        // Extract the frames.
        // Gotta use jpeg for this since png really fucked up the storage
        console.log("Extracting frames...");
        execSync(`ffmpeg -i "animes/${anime}" -r 2 -qscale:v 2 -vf "fps=2${(anime.includes(".mkv")) ? ",subtitles=animes/" + anime : ""}" -hide_banner -loglevel error -stats ./frames/${episodePad}_%04d.jpeg -y > /dev/null 2>&1`);
        // And then set up config
        config();
    } catch (err) {
        console.error(err);
        process.exit(1); // Need to kill so that index.js doesnt continue shit.
    }
}

function config() {
    const frames = fs.readdirSync("frames");
    const episode = frames[0].split("_")[0];
    
    const configs = {
        current_episode: parseInt(episode),
        max_episode: 12,
        current_frame: 1,
        max_frame: frames.length
    }
    
    // Write it to file
    fs.writeFileSync("configs/data.json", JSON.stringify(configs, null, 2));
    console.log("Creating data and frames successfully!");
}

module.exports = create;