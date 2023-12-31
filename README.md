## ESSFIO
<img src="https://harubyte.my.id/img/projects/essfio.webp" align="right" width="100" height="100">
ESSFIO or Every Slow Start Frame in Order is a Facebook page that posts frames from Slow Start every 15 minutes.

## Host Your Own
Node.js v17.5.0 or above is required and `node index` needs to be executed using a cronjob at your preferred interval, but I recommend using 10 - 15 minute intervals so as not to overwhelm the timeline.
1. Clone this repo. I won't explain how because if you don't know how to clone repo, then fuck off.
2. Go to the project directory and type `npm install` to install the required dependencies.
3. Create a `.env` file and enter your Facebook Page token inside the `TOKEN` key. [Click here](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/) to learn more.
```
TOKEN="ENTERYOURTOKENINHEREDUMBASS"
```
4. Create an "animes" directory and copy all the anime files into it with the file name being the episode number in XX format such as 01, 02, 03, and the file format should be mp4 or mkv.
5. Type the command below to generate the data.json and frame files. You can also type `node create --help` to see the available options:
```
$ node create 01
```
6. Finally, enter the `node index` command in your cronjob.

---
## Synopsis
Hana Ichinose, a 17-year-old high school student who is not only introverted, but also insecure and timid, has just moved and will be attending a new school. To make her situation more difficult, Hana is a "slow start," which means that she missed a year and worries about attending a class where everyone is younger than her.

During her introduction, the teacher reveals it is Hana's birthday, which gives her the jumping-off point to meet three of her classmates: Tamate Momochi, a charismatic and extroverted girl; Kanmuri Sengoku, who is shy and small; and the popular and pretty Eiko Tokura. Not wanting to lose the chance to make new friends, Hana's interactions with these three mark the beginning of some beautiful relationships that will change her life.

---
### This project is hosted by
<a href="https://alwaysdata.com"><img src="https://www.alwaysdata.com/static/svg/alwaysdata-logo-pink.svg" width="200" height="auto" alt="Alwaysdata"></a>
