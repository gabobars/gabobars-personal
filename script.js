/* =========================================================
   ELEMENTS
========================================================= */

const audio =
    document.getElementById("audio");

const playButton =
    document.getElementById("playButton");

const progressRange =
    document.getElementById("progressRange");

const timeCurrent =
    document.getElementById("timeCurrent");

const volumeButton =
    document.getElementById("volumeButton");

const volumeRange =
    document.getElementById("volumeRange");

const musicPlayer =
    document.getElementById("musicPlayer");

const languageToggle =
    document.getElementById("languageToggle");

const heroRotatingText =
    document.getElementById("heroRotatingText");

const aboutCopy =
    document.getElementById("aboutCopy");

const footerMessage =
    document.getElementById("footerMessage");

const sitePanel =
    document.querySelector(".site-panel");

const backgroundLayer =
    document.querySelector(".background-layer");


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    en: {

        heroLines: [
            "random guy on the internet",
            "just another streamer",
            "probably playing something",
            "making random stuff"
        ],

        aboutTitle:
            "About Me",

        aboutCopy:
            "Just a Portuguese streamer who likes games, music, and making random stuff.",

        interestsTitle:
            "Current Interests",

        footer:
            "thanks for stopping by."

    },


    pt: {

        heroLines: [
            "gajo random da internet",
            "só mais um streamer",
            "provavelmente a jogar qualquer coisa",
            "a fazer coisas random"
        ],

        aboutTitle:
            "Sobre Mim",

        aboutCopy:
            "Só um streamer português que gosta de jogos, música e de fazer coisas random.",

        interestsTitle:
            "Interesses Atuais",

        footer:
            "obrigado por passares por aqui."

    }

};


/* =========================================================
   RANDOM TEXT
========================================================= */

function pickRandom(items) {

    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];

}


/* =========================================================
   LANGUAGE
========================================================= */

function setLanguage(lang) {

    const safeLang =
        lang === "pt"
            ? "pt"
            : "en";


    localStorage.setItem(
        "gabobars_language",
        safeLang
    );


    languageToggle.dataset.lang =
        safeLang;


    const copy =
        translations[safeLang];


    /*
        Random line below the avatar.
    */

    heroRotatingText.textContent =
        pickRandom(
            copy.heroLines
        );


    /*
        About Me text.
    */

    aboutCopy.textContent =
        copy.aboutCopy;


    /*
        Footer.
    */

    footerMessage.textContent =
        copy.footer;


    /*
        Section titles.
    */

    const aboutTitle =
        document.querySelector(
            "[data-i18n='aboutTitle']"
        );

    if (aboutTitle) {

        aboutTitle.textContent =
            copy.aboutTitle;

    }


    const interestsTitle =
        document.querySelector(
            "[data-i18n='interestsTitle']"
        );

    if (interestsTitle) {

        interestsTitle.textContent =
            copy.interestsTitle;

    }


    document.documentElement.lang =
        safeLang === "pt"
            ? "pt-PT"
            : "en";

}


/* =========================================================
   LANGUAGE TOGGLE
========================================================= */

languageToggle.addEventListener(
    "click",
    () => {

        const current =
            languageToggle.dataset.lang === "pt"
                ? "pt"
                : "en";


        setLanguage(
            current === "pt"
                ? "en"
                : "pt"
        );

    }
);


/* =========================================================
   PAGE ENTRY ANIMATION
========================================================= */

window.addEventListener(
    "load",
    () => {

        requestAnimationFrame(
            () => {

                backgroundLayer.classList.add(
                    "is-visible"
                );


                sitePanel.classList.add(
                    "is-visible"
                );

            }
        );

    }
);


/* =========================================================
   MUSIC PLAYER
========================================================= */

const DEFAULT_VOLUME =
    0.10;


const savedVolume =
    Number(
        localStorage.getItem(
            "gabobars_volume"
        )
    );


audio.volume =
    Number.isFinite(savedVolume) &&
    savedVolume >= 0 &&
    savedVolume <= 1

        ? savedVolume

        : DEFAULT_VOLUME;


volumeRange.value =
    String(
        audio.volume
    );


/* =========================================================
   TIME FORMAT
========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const mins =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        )
        .toString()
        .padStart(
            2,
            "0"
        );


    return `${mins}:${secs}`;

}


/* =========================================================
   PLAY BUTTON
========================================================= */

function updatePlayButton() {

    playButton.textContent =
        audio.paused
            ? "▶"
            : "Ⅱ";


    playButton.setAttribute(
        "aria-label",
        audio.paused
            ? "Play"
            : "Pause"
    );

}


playButton.addEventListener(
    "click",
    async () => {

        if (audio.paused) {

            try {

                await audio.play();

            } catch {

                /*
                    Browser blocked autoplay/playback.
                    User can still press Play again.
                */

            }

        } else {

            audio.pause();

        }


        updatePlayButton();

    }
);


/* =========================================================
   AUDIO EVENTS
========================================================= */

audio.addEventListener(
    "play",
    updatePlayButton
);


audio.addEventListener(
    "pause",
    updatePlayButton
);


audio.addEventListener(
    "timeupdate",
    syncProgress
);


audio.addEventListener(
    "loadedmetadata",
    syncProgress
);


audio.addEventListener(
    "ended",
    () => {

        audio.currentTime = 0;

        progressRange.value =
            "0";

        timeCurrent.textContent =
            "0:00";

        updatePlayButton();

    }
);


/* =========================================================
   PROGRESS
========================================================= */

function syncProgress() {

    if (
        !Number.isFinite(
            audio.duration
        ) ||
        audio.duration <= 0
    ) {

        progressRange.value =
            "0";

        timeCurrent.textContent =
            "0:00";

        return;

    }


    progressRange.value =
        String(
            (
                audio.currentTime /
                audio.duration
            ) * 100
        );


    timeCurrent.textContent =
        formatTime(
            audio.currentTime
        );

}


progressRange.addEventListener(
    "input",
    () => {

        if (
            !Number.isFinite(
                audio.duration
            ) ||
            audio.duration <= 0
        ) {

            return;

        }


        audio.currentTime =
            (
                Number(
                    progressRange.value
                ) / 100
            ) *
            audio.duration;


        syncProgress();

    }
);


/* =========================================================
   VOLUME
========================================================= */

volumeButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        musicPlayer.classList.toggle(
            "volume-open"
        );

    }
);


volumeRange.addEventListener(
    "input",
    () => {

        const volume =
            Math.min(
                1,
                Math.max(
                    0,
                    Number(
                        volumeRange.value
                    )
                )
            );


        audio.volume =
            volume;


        localStorage.setItem(
            "gabobars_volume",
            String(volume)
        );

    }
);


document.addEventListener(
    "click",
    (event) => {

        if (
            !musicPlayer.contains(
                event.target
            )
        ) {

            musicPlayer.classList.remove(
                "volume-open"
            );

        }

    }
);


/* =========================================================
   AUTOPLAY
========================================================= */

async function tryAutoplay() {

    try {

        await audio.play();

    } catch {

        /*
            Modern browsers can block
            autoplay with sound.
        */

    }

}


window.addEventListener(
    "load",
    () => {

        tryAutoplay();

    }
);


window.addEventListener(
    "pointerdown",
    () => {

        if (
            audio.paused &&
            audio.currentTime === 0
        ) {

            tryAutoplay();

        }

    },
    {
        once: true
    }
);


/* =========================================================
   YOUR CUSTOM LINKS
========================================================= */

/*
    CIGA
*/

const cigaLink =
    document.getElementById("cigaLink");

if (cigaLink) {

    cigaLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.location.href =
                "https://ciga-website.ciga-hq.workers.dev/";

        }
    );

}


/*
    Streaming
*/

const streamingLink =
    document.getElementById("streamingLink");

if (streamingLink) {

    streamingLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.location.href =
                "https://twitch.tv/gabobars";

        }
    );

}


/*
    Video editing
*/

const editingLink =
    document.getElementById("editingLink");

if (editingLink) {

    editingLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.location.href =
                "https://www.youtube.com/@gabobars";

        }
    );

}


/* =========================================================
   INITIAL STATE
========================================================= */

setLanguage(
    localStorage.getItem(
        "gabobars_language"
    ) || "en"
);


updatePlayButton();
