console.log("JS GG");
let currentSong = new Audio;
let currentFolder;
let songs =[]

function TimeInMinSec(totalSeconds) {
    if(isNaN(totalSeconds)|| totalSeconds<0){
        return "00:00"
    }
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds =Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return minutes + ':' + seconds;
  }
async function getSongs(folder){
    currentFolder=folder;
    let a = await fetch(`https://github.com/AdityaGodambe-555/SpotifyMusicPlayerClone/tree/main/${currentFolder}/`)
    let response =await a.text()
    // console.log(response);
    let div = document.createElement('div')
    div.innerHTML=response
    let as = div.querySelectorAll('a')
    songs=[];
    // console.log(as);
    for (let i = 0;i< as.length;i++){
        const element = as[i]
        if (element.href.endsWith('.mp3')){
            songs.push(element.href.split(`/${currentFolder}/`)[1])
        }
    }
    // console.log(songs);
    // return songs
    //Display songs in the playlist
    let songsUl = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songsUl.innerHTML=""
    for (const song of songs) {
        songsUl.innerHTML=songsUl.innerHTML+
        `<li>
        <img class="invert" src="img/music.svg" alt="" >
        <div class="songInfo">
            <div>${song.replaceAll('%20',' ')}</div>
            <div>Aditya</div>
        </div>
        <div class="playnow">
            <div>Play Now</div>
            <img class="invert" src="img/playbtn.svg" alt="">
        </div>
        </li>`
    }

     //Attach eventlistener to the songs in library 
     Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e=>{
        e.addEventListener('click',element=>{
            // console.log(e.querySelector('.songInfo').firstElementChild.innerHTML);
            playMusic(e.querySelector('.songInfo').firstElementChild.innerHTML)
        })
    })
    
    return songs;
    
}

const playMusic= (track,pause=false)=>{
    currentSong.src=`/${currentFolder}/`+track
    if(!pause){
        playbtn.src="img/pausebtn.svg"
        currentSong.play()
    }
    document.querySelector('.songName').innerHTML=decodeURI(track)
    document.querySelector('.songTime').innerHTML='00.00/00.00'
    
}

async function displayAlbums(){
    let a = await fetch(`https://github.com/AdityaGodambe-555/SpotifyMusicPlayerClone/tree/main/songs/`)
    let response =await a.text()
    let div = document.createElement('div')
    div.innerHTML=response
    let as = div.getElementsByTagName('a')
    let cardContainer = document.querySelector('.cardContainer')
    let array=Array.from(as)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];

            //  console.log(e.href);
            if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
                let folder = e.href.split('/').splice(-2)[0]
                //Get the meta data of the folder from the json file
                let a = await fetch(`https://github.com/AdityaGodambe-555/SpotifyMusicPlayerClone/tree/main/songs/${folder}/info.json`)
                let response = await a.json()
                //console.log(response)
                cardContainer.innerHTML= cardContainer.innerHTML + 
                `
                <div class="card rounded" data-folder="${folder}">
                            <img src="img/greenPlay.svg" alt="" class="greenPlay">
                            <img src="songs/${folder}/cover.jpg" alt="" class="thumbnail">
                            <h3>${response.title}</h3>
                            <p>${response.Description}</p>
                        </div>
                `
            }
    }

    //Load playlist when clicked on card
    Array.from(document.getElementsByClassName('card')).forEach((e)=>{
        // console.log(e);
        e.addEventListener('click',async(e)=>{
            //console.log(e.currentTarget.dataset.folder)
            songs =await getSongs(`songs/${e.currentTarget.dataset.folder}`)
            // playMusic(songs[0])
        })
    })

    //when clicked on playlist paly button start first song of playlist
    Array.from(document.getElementsByClassName('greenPlay')).forEach((e)=>{
        // console.log(e);
        e.addEventListener('click',async(e)=>{
            console.log(e.currentTarget.parentElement.dataset.folder)
            songs = await getSongs(`songs/${e.currentTarget.parentElement.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main(){
    await getSongs(`songs/S1`)
    // console.log(songs)

    //load initail song
    playMusic(songs[0],true)

    //Display all the album on the page
    displayAlbums()

    //Attach play pause eventlistener
    playbtn.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            playbtn.src = "img/pausebtn.svg";
        } else {
            currentSong.pause();
            playbtn.src = "img/playbtn.svg";
        }
    });
    
    //eventlisterner of timestamp update
    currentSong.addEventListener('timeupdate',()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector('.songTime').innerHTML =`${TimeInMinSec(currentSong.currentTime)}/${TimeInMinSec(currentSong.duration)}`
        document.querySelector('.circle').style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    //eventlistner to the seek bar
    document.querySelector('.seekbar').addEventListener('click',(e)=>{
        let precentage = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector('.circle').style.left= precentage+"%";
        currentSong.currentTime=((currentSong.duration)*precentage)/100
    })

    //eventlistner to hamburger
    document.querySelector('.hamburger').addEventListener('click',()=>{
        document.querySelector('.left').style.left="0%"
    })

    //eventlistner to cross
    document.querySelector('.cross').addEventListener('click',()=>{
        document.querySelector('.left').style.left="-100%"
    })

    
    //eventlistner to previous
    lastbtn.addEventListener('click',()=>{
        console.log('Previous Clicked');
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })
    
    //eventlistner to next
    nextbtn.addEventListener('click',()=>{
        console.log('Next Clicked');
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })
    
    //volume button
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change',(e)=>{
        // console.log(e.target.value);
        currentSong.volume=parseInt(e.target.value)/100
    })
    
    //mute button when clicked in volume
    document.querySelector('.volume img').addEventListener('click',(e)=>{
        // console.log(e.target.src);
        const currentSrc = e.target.src;
        const isMuted = currentSrc.includes('mute.svg');
    
        // Toggle between mute and unmute
        if (isMuted) {
            // Unmute
            e.target.src = currentSrc.replace('mute.svg', 'volume.svg');
            currentSong.volume = 1; // Set volume back to 1 when unmuting
        } else {
            // Mute
            e.target.src = currentSrc.replace('volume.svg', 'mute.svg');
            currentSong.volume = 0; // Mute by setting volume to 0
        }
        
    })




}

main()