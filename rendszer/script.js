

var foresz = document.getElementById("fo")
var link = document.getElementById("link")
var fotime = 0

var player = document.getElementById("player")
var infok = document.getElementById("infok")
var selectlink = document.getElementById("selectlink")
var film = document.getElementById("film")
var varjszoveg = document.getElementById("varj")
var buttons = document.getElementById("buttons")
var p_button = document.getElementById("playpause")
var fullscreenbtn = document.getElementById("fullscreenbtn")

var link_button = document.getElementById("link_button")
var file_button = document.getElementById("file_button")
var link = document.getElementById("link")
var file = document.getElementById("file")

var timeline = document.getElementById("timeline")
var jelenlegiido = document.getElementById("jelenlegiido")
var hosszido = document.getElementById("hosszido")
var mute = document.getElementById("mute")
var synccucc = document.getElementById("synccucc")

var fullscreened = false

film.style.display = "none";
selectlink.style.display = "none";
p_button.style.display = "none";
fullscreenbtn.style.display = "none";
player.style.display = "none"
infok.style.display = "none"

if (window.location.href.split("#")[1] != "fo") {
    foresz.style.display = "none"
    player.style.position = "relative"
    player.style.marginTop = "200px"
} else {
    varjszoveg.textContent = "Válaszd ki a filmet"
    film.controls = true
}




var tipusa = "link"

if (window.location.href.split("#")[1] == "fo") {
    //alap oldal betöltésnél change nélkül
    file.style.display = "none"

    link_button.onchange = function() {
        file.style.display = "none"
        link.style.display = ""
        tipusa = "link"
    }

    file_button.onchange = function() {
        link.style.display = "none"
        file.style.display = ""
        tipusa = "file"
    }
}






function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h + ":";
    var mDisplay = m + ":";
    var sDisplay = s;

    return hDisplay + mDisplay + sDisplay;
  }




film.onplay = function () {
    p_button.style.display = "";
    fullscreenbtn.style.display = "";

    film.play()

    //if (window.___browserSync___) {
    //    window.___browserSync___.socket.emit("custom:event", { action: "play" });
    //}
    p_button.textContent = "Megállítás";
    p_button.style.backgroundColor = "red";
    p_button.style.border = "3px solid red"

    if (fullscreened) {
        applyFullscreenStyles()
    }
};

film.onpause = function () {
    p_button.style.display = "";
    fullscreenbtn.style.display = "";

    film.pause();
    //if (window.___browserSync___) {
    //    window.___browserSync___.socket.emit("custom:event", { action: "pause" });
    //}

    p_button.textContent = "Lejátszás";
    p_button.style.backgroundColor = "green";
    p_button.style.border = "3px solid green"


    if (fullscreened) {
        p_button.textContent = "Stoppolva"
        p_button.style.color = "white"
        p_button.style.backgroundColor = "transparent";
        p_button.style.opacity = "1"
        p_button.style.border = "none"
    } else {
        p_button.textContent = "Lejátszás";
        p_button.style.backgroundColor = "green";
        p_button.style.border = "3px solid green"
    }
};




if (window.___browserSync___) {
    console.log("asd")
    window.___browserSync___.socket.on("custom:event", function (data) {
        console.log(data.action)
        if (data.action === "play" && film.paused) {
            film.play()
        } else if (data.action === "pause" && !film.paused) {
            film.pause()
        } else if (data.action === "linkvalasztva") {
            linkvalasztva(data.data, data.tipus)
        } else if (data.action === "timeupdate") {
            ugras(data.data)
        } else if (data.action === "timesave_synchez") {
            fotime = data.data
        }
    });
}



function playpause() {
    if (film.paused) {
        if (window.___browserSync___) {
            window.___browserSync___.socket.emit("custom:event", { action: "play" });
        }

        setTimeout(() => {
            film.play()
        }, 99);
    } else {
        if (window.___browserSync___) {
            window.___browserSync___.socket.emit("custom:event", { action: "pause" });
        }

        setTimeout(() => {
            film.pause()
        }, 99);
    }
}



function linkadded() {
    selectlink.style.display = "";
}



function linkvalasztva(masbrowseres, tipus) {
    if (tipus == undefined) {
        tipus = tipusa
    }

    console.log(tipus)

    if (masbrowseres != undefined) {
        if (tipus == "link") {
            link.value = masbrowseres
        } else if (tipus == "file") {
            file.value = masbrowseres
        }
    } else {
        var textboxerteke = undefined

        if (tipus == "link") {
            textboxerteke = link.value
        } else if (tipus == "file") {
            textboxerteke = file.value
        }

        if (window.___browserSync___) {
            window.___browserSync___.socket.emit("custom:event", { action: "linkvalasztva", data: textboxerteke, tipus: tipusa});
        }
    }


    if (tipus == "link") {
        var kivalasztott_film = link.value
    } else if (tipus == "file") {
        var kivalasztott_film = file.value
    }
    

    if (kivalasztott_film) {    
        var film_source = document.getElementById("film_source");

        if (tipus == "link") {
            film_source.src = kivalasztott_film
        } else if (tipus == "file") {
            film_source.src = `./${kivalasztott_film}`
        }

        film.load()
        film.poster = "./loaded.png";

        varjszoveg.style.display = "none"

        if (window.location.href.split("#")[1] == "fo") {
            p_button.style.display = "";
            fullscreenbtn.style.display = "";
        }

        player.style.display = ""
        infok.style.display = ""
    
        film.style.display = "";
        console.log(film_source);
    }
}


film.addEventListener('click', (event) => {
    event.preventDefault();
});


film.onloadeddata = function() {
    hosszido.textContent = secondsToHms(film.duration)
}

var elozotime = undefined

film.ontimeupdate = function() {
    const percentagePosition = (100*film.currentTime) / film.duration;
    timeline.style.backgroundSize = `${percentagePosition}% 100%`;

    jelenlegiido.textContent = secondsToHms(film.currentTime)


    if (window.location.href.split("#")[1] == "fo") {
        if (elozotime) {
            if ((film.currentTime - elozotime > 2) || (elozotime - film.currentTime > 2)) {
                //tekert a boss

                setTimeout(() => {
                    film.pause()
                }, 100);

                if (window.___browserSync___) {
                    window.___browserSync___.socket.emit("custom:event", { action: "pause" });

                    setTimeout(() => {
                        window.___browserSync___.socket.emit("custom:event", { action: "timeupdate", data: film.currentTime});
                    }, 300);
                }

                elozotime = film.currentTime

            } else {
                //nem tekert a boss
                elozotime = film.currentTime

            }
        } else {
            elozotime = film.currentTime
        }

        window.___browserSync___.socket.emit("custom:event", { action: "timesave_synchez", data: film.currentTime});
    }
}


function ugras(hova) {
    film.currentTime = hova
    elozotime = hova
}



mute.onclick = function() {
    if (!film.muted) {
        film.muted = true
        mute.textContent = "Kinémítás"
    } else {
        film.muted = false
        mute.textContent = "Némítás"
    }
}


synccucc.onclick = function() {
    if (window.___browserSync___) {
        window.___browserSync___.socket.emit("custom:event", { action: "pause" });

        ugras(fotime)
    }
}



/////////////////////////////////////////////////////////////Fullscreenes cuccok
fullscreenbtn.onclick = function () {
    toggleFullscreen();
};

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
            player.requestFullscreen().catch((err) => {
                resetFullscreenStyles();
            });
        } else if (player.mozRequestFullScreen) {
            player.mozRequestFullScreen().catch((err) => {
                resetFullscreenStyles();
            }); // Firefox
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen().catch((err) => {
                resetFullscreenStyles();
            }); // Chrome, Safari, and Opera
        } else if (player.msRequestFullscreen) {
            player.msRequestFullscreen().catch((err) => {
                resetFullscreenStyles();
            }); // IE/Edge
        }

        fullscreened = true
        applyFullscreenStyles();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch((err) => {
                resetFullscreenStyles();
            });
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen().catch((err) => {
                resetFullscreenStyles();
            }); // Firefox
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().catch((err) => {
                resetFullscreenStyles();
            }); // Chrome, Safari, and Opera
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen().catch((err) => {
                resetFullscreenStyles();
            }); // IE/Edge
        }

        fullscreened = false
        resetFullscreenStyles();
    }
}


function applyFullscreenStyles() {
    player.style.border = "none"

    if (screen.width < screen.height) {
        film.style.position = "relative"
        film.style.top = "0"
        film.style.left = "0"
        film.style.width = "100vh"
        film.style.height = "100vw"
        film.style.transform = "rotate(90deg) translate(0%,0%)"
        film.style.transformOrigin = "center center"
        film.style.backgroundColor = "black"
    
        buttons.style.marginTop = "0px"
        buttons.style.rotate = "90deg"
        buttons.style.position = "fixed"
        buttons.style.width = "100vh"
        buttons.style.height = "60vw"
        buttons.style.justifyContent = "space-between"
    
        p_button.style.color = "transparent"
        p_button.style.width = "65%"
        p_button.style.opacity = "0"
        fullscreenbtn.style.color = "transparent"
        fullscreenbtn.style.width = "30%"
        fullscreenbtn.style.opacity = "0"
    }
}


function resetFullscreenStyles() {
    player.style.border = "3px solid rgb(100,0,0)"

    if (screen.width < screen.height) {
        film.style.position = "relative"
        film.style.top = "0"
        film.style.left = "0"
        film.style.width = "100%"
        film.style.height = "100%"
        film.style.transform = "rotate(0deg) translate(0%,0%)"
        film.style.transformOrigin = "center center"
        film.style.backgroundColor = "black"
    
        buttons.style.marginTop = "40px"
        buttons.style.rotate = "0deg"
        buttons.style.position = "relative"
        buttons.style.width = "100%"
        buttons.style.height = "fit-content"
        buttons.style.justifyContent = "space-around"
    
        p_button.style.color = "black"
        p_button.style.width = "fit-content"
        p_button.style.opacity = "1"
        fullscreenbtn.style.color = "black"
        fullscreenbtn.style.width = "fit-content"
        fullscreenbtn.style.opacity = "1"
    }
}


if (window.___browserSync___) {
    window.___browserSync___.socket.on("custom:event", function (data) {
        if (data.action === "fullscreen-triggered") {
            console.log("Fullscreen triggered, but not syncing this action.");
        }
    });
}
