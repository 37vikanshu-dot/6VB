/* =========================================================
   SIX MONTHS OF US ❤️
   SCRIPT.JS — PART 1
   FOUNDATION + LOADER + SCROLL REVEAL
   ========================================================= */

"use strict";


/* =========================================================
   01 — SAFE SELECTORS
   ========================================================= */

const $ = (selector, parent = document) => {

    return parent.querySelector(selector);

};


const $$ = (selector, parent = document) => {

    return Array.from(
        parent.querySelectorAll(selector)
    );

};


/* =========================================================
   02 — GLOBAL WEBSITE STATE
   ========================================================= */

const App = {

    loaded: false,

    introFinished: false,

    firstInteractionDone: false,

    voiceStarted: false,

    musicStarted: false,

    secretUnlocked: false,

    finalSurpriseOpen: false,

    currentSection: null

};


/* =========================================================
   03 — DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeWebsite();

});


/* =========================================================
   04 — INITIALIZE WEBSITE
   ========================================================= */

function initializeWebsite() {

    try {

        setupLoader();

        setupScrollReveal();

        setupSmoothNavigation();

        setupImageLoading();

        setupReducedMotion();

        setupBasicInteractions();

        App.loaded = true;

    } catch (error) {

        console.error(
            "Website initialization error:",
            error
        );

        /*
         * Important:
         * One broken optional feature should NOT
         * stop the entire website.
         */

    }

}


/* =========================================================
   05 — PAGE LOADER
   ========================================================= */

function setupLoader() {

    const loader =
        $(".page-loader");

    if (!loader) {

        startIntro();

        return;

    }


    /*
     * Give the browser a moment to render
     * the opening screen beautifully.
     */

    const minimumLoaderTime =
        1200;


    const startTime =
        performance.now();


    function hideLoader() {

        const elapsed =
            performance.now() - startTime;

        const remaining =
            Math.max(
                0,
                minimumLoaderTime - elapsed
            );


        setTimeout(() => {

            loader.classList.add(
                "loader-hidden"
            );


            document.body.classList.add(
                "intro-complete"
            );


            setTimeout(() => {

                loader.style.display =
                    "none";

                startIntro();

            }, 700);


        }, remaining);

    }


    if (document.readyState === "complete") {

        hideLoader();

    } else {

        window.addEventListener(
            "load",
            hideLoader,
            {
                once: true
            }
        );

    }

}


/* =========================================================
   06 — INTRO START
   ========================================================= */

function startIntro() {

    if (App.introFinished) {

        return;

    }


    App.introFinished = true;


    /*
     * Start any visual effects that are safe
     * before the user's first interaction.
     */

    document.body.classList.add(
        "intro-complete"
    );


    /*
     * We intentionally DO NOT start audio here.
     *
     * Browsers usually block audio autoplay.
     *
     * Audio will be started after the user's
     * first tap/click in a later JS part.
     */


    createInitialAmbientHearts();

}


/* =========================================================
   07 — SCROLL REVEAL
   ========================================================= */

function setupScrollReveal() {

    const elements =
        $$("[data-reveal]");


    if (!elements.length) {

        return;

    }


    /*
     * Fallback for browsers without
     * IntersectionObserver.
     */

    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add(
                "revealed"
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {

                        return;

                    }


                    const element =
                        entry.target;


                    element.classList.add(
                        "revealed"
                    );


                    /*
                     * Once revealed, stop observing
                     * to improve performance.
                     */

                    observer.unobserve(
                        element
                    );

                });

            },
            {

                threshold: 0.12,

                rootMargin:
                    "0px 0px -50px 0px"

            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================================
   08 — SMOOTH NAVIGATION
   ========================================================= */

function setupSmoothNavigation() {

    const links =
        $$('a[href^="#"]');


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href === "#"
                ) {

                    return;

                }


                const target =
                    $(href);


                if (!target) {

                    return;

                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });


                /*
                 * Update the URL without causing
                 * a page reload.
                 */

                try {

                    history.replaceState(
                        null,
                        "",
                        href
                    );

                } catch (error) {

                    /*
                     * Ignore history errors.
                     */

                }

            }
        );

    });

}


/* =========================================================
   09 — IMAGE LOADING
   ========================================================= */

function setupImageLoading() {

    const images =
        $$(".memory-image img");


    if (!images.length) {

        return;

    }


    images.forEach(image => {

        /*
         * Already loaded from cache.
         */

        if (image.complete) {

            if (image.naturalWidth > 0) {

                image.classList.add(
                    "image-loaded"
                );

            } else {

                markImageError(
                    image
                );

            }

            return;

        }


        image.addEventListener(
            "load",
            () => {

                image.classList.add(
                    "image-loaded"
                );

            },
            {
                once: true
            }
        );


        image.addEventListener(
            "error",
            () => {

                markImageError(
                    image
                );

            },
            {
                once: true
            }
        );

    });

}


function markImageError(image) {

    const container =
        image.closest(
            ".memory-image"
        );


    if (container) {

        container.classList.add(
            "image-error"
        );

    }


    /*
     * Keep the website working even when
     * a photo hasn't been added yet.
     */

    image.style.display =
        "none";

}


/* =========================================================
   10 — REDUCED MOTION
   ========================================================= */

function setupReducedMotion() {

    const mediaQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    function applyMotionPreference() {

        if (mediaQuery.matches) {

            document.body.classList.add(
                "reduced-motion"
            );

        } else {

            document.body.classList.remove(
                "reduced-motion"
            );

        }

    }


    applyMotionPreference();


    if (
        typeof mediaQuery.addEventListener ===
        "function"
    ) {

        mediaQuery.addEventListener(
            "change",
            applyMotionPreference
        );

    }

}


/* =========================================================
   11 — BASIC INTERACTIONS
   ========================================================= */

function setupBasicInteractions() {

    /*
     * Add a subtle active state to cards
     * when touched/clicked.
     */

    const cards =
        $$(".memory-card");


    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                cards.forEach(
                    otherCard => {

                        if (
                            otherCard !== card
                        ) {

                            otherCard.classList.remove(
                                "active"
                            );

                        }

                    }
                );


                card.classList.toggle(
                    "active"
                );

            }
        );

    });

}


/* =========================================================
   12 — INITIAL AMBIENT HEARTS
   ========================================================= */

function createInitialAmbientHearts() {

    /*
     * Only a few hearts at the beginning.
     *
     * The larger particle system comes later.
     */

    const amount =
        window.innerWidth < 600
            ? 3
            : 5;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        setTimeout(
            () => {

                createFloatingHeart({
                    startX:
                        Math.random() *
                        window.innerWidth,

                    startY:
                        window.innerHeight +
                        20
                });

            },
            i * 900
        );

    }

}


/* =========================================================
   13 — FLOATING HEART CREATOR
   ========================================================= */

function createFloatingHeart(options = {}) {

    const heart =
        document.createElement(
            "span"
        );


    heart.className =
        "floating-heart";


    heart.textContent =
        Math.random() > .5
            ? "♥"
            : "♡";


    const startX =
        Number.isFinite(
            options.startX
        )
            ? options.startX
            : Math.random() *
              window.innerWidth;


    const startY =
        Number.isFinite(
            options.startY
        )
            ? options.startY
            : window.innerHeight;


    const size =
        12 +
        Math.random() * 14;


    const duration =
        3.5 +
        Math.random() * 2.5;


    const horizontalMovement =
        -80 +
        Math.random() * 160;


    const rotation =
        -40 +
        Math.random() * 80;


    heart.style.left =
        `${startX}px`;


    heart.style.top =
        `${startY}px`;


    heart.style.setProperty(
        "--heart-size",
        `${size}px`
    );


    heart.style.setProperty(
        "--heart-duration",
        `${duration}s`
    );


    heart.style.setProperty(
        "--heart-x",
        `${horizontalMovement}px`
    );


    heart.style.setProperty(
        "--heart-rotation",
        `${rotation}deg`
    );


    document.body.appendChild(
        heart
    );


    setTimeout(
        () => {

            heart.remove();

        },
        (duration + 1) * 1000
    );


    return heart;

}


/* =========================================================
   14 — GLOBAL FIRST INTERACTION
   ========================================================= */

function setupFirstInteraction() {

    /*
     * This function will be completed in
     * SCRIPT.JS PART 2.
     *
     * We create the listener here so the
     * system is ready.
     */

    const events = [
        "pointerdown",
        "touchstart",
        "keydown"
    ];


    const firstInteraction =
        event => {

            if (
                App.firstInteractionDone
            ) {

                return;

            }


            /*
             * Don't count modifier-only
             * keyboard presses as interaction.
             */

            if (
                event.type === "keydown" &&
                (
                    event.key ===
                    "Shift" ||

                    event.key ===
                    "Control" ||

                    event.key ===
                    "Alt" ||

                    event.key ===
                    "Meta"
                )
            ) {

                return;

            }


            App.firstInteractionDone =
                true;


            /*
             * Remove every listener so this
             * happens exactly once.
             */

            events.forEach(
                eventName => {

                    document.removeEventListener(
                        eventName,
                        firstInteraction,
                        true
                    );

                }
            );


            /*
             * The actual music + voice system
             * is connected in PART 2.
             */

            handleFirstInteraction(
                event
            );

        };


    events.forEach(
        eventName => {

            document.addEventListener(
                eventName,
                firstInteraction,
                true
            );

        }
    );

}


/* =========================================================
   15 — FIRST INTERACTION HANDLER
   ========================================================= */

function handleFirstInteraction(event) {

    /*
     * Temporary foundation.
     *
     * PART 2 will connect:
     *
     * 1. Voice message
     * 2. Background music
     * 3. V + B animation
     * 4. First-tap cinematic sequence
     */

    document.body.classList.add(
        "user-interacted"
    );


    /*
     * Small visual feedback.
     */

    createClickHeart(
        event
    );

}


/* =========================================================
   16 — CLICK HEART
   ========================================================= */

function createClickHeart(event) {

    if (
        !event ||
        typeof event.clientX !==
            "number"
    ) {

        return;

    }


    const heart =
        document.createElement(
            "span"
        );


    heart.className =
        "click-heart";


    heart.textContent =
        "♥";


    heart.style.left =
        `${event.clientX}px`;


    heart.style.top =
        `${event.clientY}px`;


    const angle =
        Math.random() *
        Math.PI *
        2;


    const distance =
        30 +
        Math.random() * 45;


    heart.style.setProperty(
        "--burst-x",
        `${Math.cos(angle) * distance}px`
    );


    heart.style.setProperty(
        "--burst-y",
        `${Math.sin(angle) * distance}px`
    );


    document.body.appendChild(
        heart
    );


    setTimeout(
        () => {

            heart.remove();

        },
        1100
    );

}


/* =========================================================
   17 — START FIRST INTERACTION SYSTEM
   ========================================================= */

setupFirstInteraction();


/* =========================================================
   END OF SCRIPT.JS — PART 1
   ========================================================= */



   /* =========================================================
   SIX MONTHS OF US ❤️
   SCRIPT.JS — PART 2
   FIRST TAP + AUDIO + V ❤️ B INTRO
   ========================================================= */


/* =========================================================
   18 — AUDIO ELEMENTS
   ========================================================= */

const backgroundMusic =
    $("#backgroundMusic") ||
    $("#bgMusic") ||
    $("audio[data-background-music]");


const voiceAudio =
    $("#voiceMessageAudio") ||
    $("#voiceAudio");


/*
 * If your HTML uses a different audio ID,
 * these variables can still remain null.
 *
 * The website will simply skip that feature
 * instead of crashing.
 */


/* =========================================================
   19 — AUDIO SETTINGS
   ========================================================= */

const AudioSystem = {

    musicVolume: 0.22,

    voiceVolume: 1,

    musicStarted: false,

    voiceStarted: false,

    musicWasBlocked: false,

    voiceWasBlocked: false

};


/* =========================================================
   20 — PREPARE AUDIO
   ========================================================= */

function prepareAudio() {

    if (backgroundMusic) {

        backgroundMusic.volume =
            AudioSystem.musicVolume;

        backgroundMusic.loop =
            true;

        /*
         * Prevent the browser from loading
         * too much audio immediately.
         */

        try {

            backgroundMusic.preload =
                "auto";

        } catch (error) {

            console.warn(
                "Could not configure background music."
            );

        }

    }


    if (voiceAudio) {

        voiceAudio.volume =
            AudioSystem.voiceVolume;

        try {

            voiceAudio.preload =
                "metadata";

        } catch (error) {

            console.warn(
                "Could not configure voice audio."
            );

        }

    }

}


prepareAudio();


/* =========================================================
   21 — START BACKGROUND MUSIC
   ========================================================= */

async function startBackgroundMusic() {

    if (!backgroundMusic) {

        console.warn(
            "Background music element not found."
        );

        return false;

    }


    if (AudioSystem.musicStarted) {

        return true;

    }


    try {

        backgroundMusic.volume =
            AudioSystem.musicVolume;


        backgroundMusic.loop =
            true;


        /*
         * Restart only if it has never played.
         */

        if (
            backgroundMusic.currentTime >
            0
        ) {

            backgroundMusic.currentTime =
                0;

        }


        const playPromise =
            backgroundMusic.play();


        /*
         * Some browsers return undefined
         * instead of a Promise.
         */

        if (
            playPromise &&
            typeof playPromise.then ===
                "function"
        ) {

            await playPromise;

        }


        AudioSystem.musicStarted =
            true;

        App.musicStarted =
            true;


        document.body.classList.add(
            "music-playing"
        );


        return true;

    } catch (error) {

        AudioSystem.musicWasBlocked =
            true;


        console.warn(
            "Background music could not start:",
            error
        );


        /*
         * The browser may allow it on
         * the next user interaction.
         */

        return false;

    }

}


/* =========================================================
   22 — START VOICE MESSAGE
   ========================================================= */

async function startVoiceMessage() {

    if (!voiceAudio) {

        console.warn(
            "Voice message audio element not found."
        );

        return false;

    }


    if (AudioSystem.voiceStarted) {

        return true;

    }


    try {

        voiceAudio.volume =
            AudioSystem.voiceVolume;


        voiceAudio.currentTime =
            0;


        const playPromise =
            voiceAudio.play();


        if (
            playPromise &&
            typeof playPromise.then ===
                "function"
        ) {

            await playPromise;

        }


        AudioSystem.voiceStarted =
            true;

        App.voiceStarted =
            true;


        document.body.classList.add(
            "voice-playing"
        );


        const voiceCard =
            $("#voiceCard");


        if (voiceCard) {

            voiceCard.classList.add(
                "playing"
            );

        }


        return true;

    } catch (error) {

        AudioSystem.voiceWasBlocked =
            true;


        console.warn(
            "Voice message could not start:",
            error
        );


        return false;

    }

}


/* =========================================================
   23 — FIRST TAP AUDIO SEQUENCE
   ========================================================= */

async function startFirstTapExperience() {

    document.body.classList.add("first-tap");

    // Start V ❤️ B animation
    startInitialLettersAnimation();

    // Start YOUR VOICE ONLY
    if (voiceAudio) {

        try {

            // Always begin from the start
            voiceAudio.currentTime = 0;

            // Full voice volume
            voiceAudio.volume = 1;

            await voiceAudio.play();

            AudioSystem.voiceStarted = true;
            App.voiceStarted = true;

            document.body.classList.add(
                "voice-playing"
            );

        } catch (error) {

            console.warn(
                "Voice message could not start:",
                error
            );

            showAudioHint();

        }

    }

}


/* =========================================================
   24 — OVERRIDE FIRST INTERACTION HANDLER
   ========================================================= */

function handleFirstInteraction(event) {

    if (
        App.firstInteractionDone !==
        true
    ) {

        return;

    }


    document.body.classList.add(
        "user-interacted"
    );


    /*
     * Small heart burst where the user tapped.
     */

    createClickHeart(
        event
    );


    /*
     * Start the complete first-tap experience.
     */

    startFirstTapExperience();

}


/* =========================================================
   25 — INITIAL V ❤️ B ANIMATION
   ========================================================= */

function startInitialLettersAnimation() {

    const v =
        $("#initialV") ||
        $(".initial-v") ||
        $("[data-initial='V']");


    const b =
        $("#initialB") ||
        $(".initial-b") ||
        $("[data-initial='B']");


    const heart =
        $("#initialHeart") ||
        $(".initial-heart");


    const initials =
        $("#initials") ||
        $(".initials-container") ||
        $(".initials");


    if (!initials) {

        console.warn(
            "Initials container not found."
        );

        return;

    }


    /*
     * Reset any previous animation state.
     */

    initials.classList.remove(
        "initial-animation-started",
        "initial-animation-complete"
    );


    if (v) {

        v.classList.remove(
            "initial-v-show",
            "initial-v-move"
        );

    }


    if (b) {

        b.classList.remove(
            "initial-b-show",
            "initial-b-move"
        );

    }


    if (heart) {

        heart.classList.remove(
            "initial-heart-show",
            "initial-heart-pulse"
        );

    }


    /*
     * Force browser reflow.
     *
     * This allows the animation to replay
     * reliably.
     */

    void initials.offsetWidth;


    initials.classList.add(
        "initial-animation-started"
    );


    /*
     * V appears.
     */

    setTimeout(
        () => {

            if (v) {

                v.classList.add(
                    "initial-v-show"
                );

            }

        },
        150
    );


    /*
     * B appears.
     */

    setTimeout(
        () => {

            if (b) {

                b.classList.add(
                    "initial-b-show"
                );

            }

        },
        500
    );


    /*
     * Both initials move toward the center.
     */

    setTimeout(
        () => {

            if (v) {

                v.classList.add(
                    "initial-v-move"
                );

            }


            if (b) {

                b.classList.add(
                    "initial-b-move"
                );

            }

        },
        1050
    );


    /*
     * Heart appears between them.
     */

    setTimeout(
        () => {

            if (heart) {

                heart.classList.add(
                    "initial-heart-show"
                );

            }

        },
        1550
    );


    /*
     * Heartbeat.
     */

    setTimeout(
        () => {

            if (heart) {

                heart.classList.add(
                    "initial-heart-pulse"
                );

            }

            initials.classList.add(
                "initial-animation-complete"
            );

        },
        2200
    );


    /*
     * Remove temporary intro class later.
     */

    setTimeout(
        () => {

            initials.classList.add(
                "initial-animation-finished"
            );

        },
        4200
    );

}


/* =========================================================
   26 — AUDIO HINT
   ========================================================= */

function showAudioHint() {

    /*
     * Don't show a huge annoying popup.
     * Just create a subtle hint.
     */

    let hint =
        $("#audioHint");


    if (!hint) {

        hint =
            document.createElement(
                "div"
            );


        hint.id =
            "audioHint";


        hint.className =
            "audio-hint";


        hint.innerHTML = `
            <span>🎙️</span>
            <p>Tap once more to hear my message ❤️</p>
        `;


        document.body.appendChild(
            hint
        );

    }


    requestAnimationFrame(
        () => {

            hint.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            hint.classList.remove(
                "show"
            );

        },
        4500
    );

}


/* =========================================================
   27 — RETRY AUDIO ON NEXT INTERACTION
   ========================================================= */

function setupAudioRetry() {

    const retry =
        async () => {

            /*
             * If everything already started,
             * there is nothing to retry.
             */

            if (
                AudioSystem.voiceStarted &&
                AudioSystem.musicStarted
            ) {

                return;

            }


            if (
                !AudioSystem.voiceStarted
            ) {

                await startVoiceMessage();

            }


            if (
                !AudioSystem.musicStarted
            ) {

                await startBackgroundMusic();

            }

        };


    document.addEventListener(
        "click",
        retry,
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        retry,
        {
            passive: true
        }
    );

}


setupAudioRetry();


/* =========================================================
   28 — VOICE AUDIO EVENTS
   ========================================================= */

if (voiceAudio) {

    voiceAudio.addEventListener(
        "play",
        () => {

            App.voiceStarted =
                true;

            AudioSystem.voiceStarted =
                true;


            const card =
                $("#voiceCard");


            if (card) {

                card.classList.add(
                    "playing"
                );

            }


            document.body.classList.add(
                "voice-playing"
            );

        }
    );


    voiceAudio.addEventListener(
        "pause",
        () => {

            const card =
                $("#voiceCard");


            if (card) {

                card.classList.remove(
                    "playing"
                );

            }


            document.body.classList.remove(
                "voice-playing"
            );

        }
    );


    voiceAudio.addEventListener(
        "ended",
        () => {

            const card =
                $("#voiceCard");


            if (card) {

                card.classList.remove(
                    "playing"
                );

            }


            document.body.classList.remove(
                "voice-playing"
            );


            /*
             * After the personal voice message ends,
             * let the background music become slightly
             * more noticeable.
             */

            if (backgroundMusic) {

                backgroundMusic.volume =
                    Math.min(
                        .35,
                        AudioSystem.musicVolume +
                        .08
                    );

            }

        }
    );


    voiceAudio.addEventListener(
        "error",
        () => {

            console.warn(
                "Could not load voice-message.mp3"
            );

        }
    );

}


/* =========================================================
   29 — BACKGROUND MUSIC EVENTS
   ========================================================= */

if (backgroundMusic) {

    backgroundMusic.addEventListener(
        "play",
        () => {

            document.body.classList.add(
                "music-playing"
            );

        }
    );


    backgroundMusic.addEventListener(
        "pause",
        () => {

            document.body.classList.remove(
                "music-playing"
            );

        }
    );


    backgroundMusic.addEventListener(
        "error",
        () => {

            console.warn(
                "Could not load background music."
            );

        }
    );

}


/* =========================================================
   30 — VOICE PROGRESS
   ========================================================= */

function setupVoiceProgress() {

    if (!voiceAudio) {

        return;

    }


    const progress =
        $("#voiceProgress");


    const time =
        $("#voiceTime");


    if (!progress) {

        return;

    }


    voiceAudio.addEventListener(
        "timeupdate",
        () => {

            if (
                !voiceAudio.duration ||
                !Number.isFinite(
                    voiceAudio.duration
                )
            ) {

                return;

            }


            const percentage =
                (
                    voiceAudio.currentTime /
                    voiceAudio.duration
                ) * 100;


            progress.style.width =
                `${percentage}%`;


            if (time) {

                time.textContent =
                    formatTime(
                        voiceAudio.currentTime
                    );

            }

        }
    );


    voiceAudio.addEventListener(
        "loadedmetadata",
        () => {

            if (time) {

                time.textContent =
                    "0:00";

            }

        }
    );

}


setupVoiceProgress();


/* =========================================================
   31 — TIME FORMATTER
   ========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;

}


/* =========================================================
   32 — VOICE PLAY BUTTON
   ========================================================= */

function setupVoiceButton() {

    const button =
        $("#voicePlayButton");


    if (!button || !voiceAudio) {

        return;

    }


    button.addEventListener(
        "click",
        async event => {

            event.stopPropagation();


            if (
                voiceAudio.paused
            ) {

                const started =
                    await startVoiceMessage();


                if (started) {

                    button.innerHTML =
                        `<i class="fa-solid fa-pause"></i>`;

                }

            } else {

                voiceAudio.pause();


                button.innerHTML =
                    `<i class="fa-solid fa-play"></i>`;

            }

        }
    );


    voiceAudio.addEventListener(
        "play",
        () => {

            button.innerHTML =
                `<i class="fa-solid fa-pause"></i>`;

        }
    );


    voiceAudio.addEventListener(
        "pause",
        () => {

            button.innerHTML =
                `<i class="fa-solid fa-play"></i>`;

        }
    );


    voiceAudio.addEventListener(
        "ended",
        () => {

            button.innerHTML =
                `<i class="fa-solid fa-play"></i>`;

        }
    );

}


setupVoiceButton();


/* =========================================================
   33 — CLICKING PROGRESS BAR
   ========================================================= */

function setupVoiceSeek() {

    const progressContainer =
        $(".voice-progress");


    if (
        !progressContainer ||
        !voiceAudio
    ) {

        return;

    }


    progressContainer.addEventListener(
        "click",
        event => {

            if (
                !Number.isFinite(
                    voiceAudio.duration
                )
            ) {

                return;

            }


            const rect =
                progressContainer.getBoundingClientRect();


            const clickPosition =
                event.clientX -
                rect.left;


            const percentage =
                Math.max(
                    0,
                    Math.min(
                        1,
                        clickPosition /
                        rect.width
                    )
                );


            voiceAudio.currentTime =
                voiceAudio.duration *
                percentage;

        }
    );

}


setupVoiceSeek();


/* =========================================================
   34 — END OF SCRIPT.JS — PART 2
   ========================================================= */
   /* =========================================================
   SIX MONTHS OF US ❤️
   SCRIPT.JS — PART 3
   SECRET MESSAGE + MOTIVATION + INTERACTIONS
   ========================================================= */


/* =========================================================
   35 — SECRET MESSAGE
   ========================================================= */

function setupSecretMessage() {

    const secretBox =
        $("#secretBox");

    const unlockButton =
        $("#unlockSecret");

    if (
        !secretBox ||
        !unlockButton
    ) {

        return;

    }


    unlockButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (
                App.secretUnlocked
            ) {

                return;

            }


            App.secretUnlocked =
                true;


            secretBox.classList.add(
                "unlocked"
            );


            /*
             * Create a small heart burst
             * around the secret card.
             */

            createSecretHeartBurst(
                secretBox
            );


            /*
             * Little vibration on supported phones.
             */

            if (
                navigator.vibrate
            ) {

                try {

                    navigator.vibrate(
                        [30, 40, 50]
                    );

                } catch (error) {

                    /*
                     * Ignore vibration errors.
                     */

                }

            }

        }
    );

}


setupSecretMessage();


/* =========================================================
   36 — SECRET HEART BURST
   ========================================================= */

function createSecretHeartBurst(container) {

    if (!container) {

        return;

    }


    const amount =
        window.innerWidth < 600
            ? 10
            : 16;


    const rect =
        container.getBoundingClientRect();


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "click-heart";


        heart.textContent =
            i % 2 === 0
                ? "♥"
                : "♡";


        const x =
            rect.left +
            rect.width / 2;


        const y =
            rect.top +
            rect.height / 2;


        heart.style.left =
            `${x}px`;


        heart.style.top =
            `${y}px`;


        const angle =
            (
                Math.PI * 2 * i
            ) /
            amount;


        const distance =
            45 +
            Math.random() * 100;


        heart.style.setProperty(
            "--burst-x",
            `${Math.cos(angle) * distance}px`
        );


        heart.style.setProperty(
            "--burst-y",
            `${Math.sin(angle) * distance}px`
        );


        heart.style.fontSize =
            `${10 + Math.random() * 13}px`;


        document.body.appendChild(
            heart
        );


        setTimeout(
            () => {

                heart.remove();

            },
            1100
        );

    }

}


/* =========================================================
   37 — MOTIVATION MESSAGES
   ========================================================= */

const motivationMessages = [

    "You can do this. I believe in you. ❤️",

    "One chapter at a time. Don't give up. 🌷",

    "Future you will thank you for studying today. ✨",

    "You're capable of much more than you think. 🥹",

    "Take a breath, focus, and keep going. 📚",

    "Don't compare your journey with anyone else's. 🌱",

    "Even a little progress is still progress. 🤍",

    "Now go make yourself proud. 😤❤️",

    "Your dreams deserve your effort. 🌙",

    "I'm cheering for you from wherever I am. ❤️",

    "Study now, celebrate later. 😌",

    "You don't have to be perfect. Just don't stop. ✨",

    "You've got this, silly. Now get back to studying. 😂❤️",

    "One day you'll look back and be proud you didn't quit."

];


let lastMotivationIndex =
    -1;


/* =========================================================
   38 — MOTIVATION BUTTON
   ========================================================= */

function setupMotivationButton() {

    const button =
        $("#motivationButton");

    const result =
        $("#motivationResult");

    const text =
        $("#motivationText");


    if (
        !button ||
        !result ||
        !text
    ) {

        return;

    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            let index;


            /*
             * Avoid immediately showing the
             * same message twice.
             */

            do {

                index =
                    Math.floor(
                        Math.random() *
                        motivationMessages.length
                    );

            } while (
                index ===
                lastMotivationIndex &&
                motivationMessages.length > 1
            );


            lastMotivationIndex =
                index;


            text.textContent =
                motivationMessages[index];


            result.classList.remove(
                "show"
            );


            /*
             * Force reflow so the animation
             * can replay every time.
             */

            void result.offsetWidth;


            result.classList.add(
                "show"
            );


            createFloatingHeart({

                startX:
                    button.getBoundingClientRect().left +
                    button.offsetWidth / 2,

                startY:
                    button.getBoundingClientRect().top

            });

        }
    );

}


setupMotivationButton();


/* =========================================================
   39 — PROMISE CARD INTERACTIONS
   ========================================================= */

function setupPromiseCards() {

    const cards =
        $$(".promise-card");


    if (!cards.length) {

        return;

    }


    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                cards.forEach(
                    other => {

                        if (
                            other !== card
                        ) {

                            other.classList.remove(
                                "promise-selected"
                            );

                        }

                    }
                );


                card.classList.toggle(
                    "promise-selected"
                );


                createFloatingHeart({

                    startX:
                        card.getBoundingClientRect().left +
                        card.offsetWidth / 2,

                    startY:
                        card.getBoundingClientRect().top +
                        30

                });

            }
        );

    });

}


setupPromiseCards();


/* =========================================================
   40 — FUTURE CARD INTERACTIONS
   ========================================================= */

function setupFutureCards() {

    const cards =
        $$(".future-card");


    if (!cards.length) {

        return;

    }


    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                cards.forEach(
                    other => {

                        if (
                            other !== card
                        ) {

                            other.classList.remove(
                                "future-selected"
                            );

                        }

                    }
                );


                card.classList.toggle(
                    "future-selected"
                );

            }
        );

    });

}


setupFutureCards();


/* =========================================================
   41 — CONFESSION CARD INTERACTIONS
   ========================================================= */

function setupConfessionCards() {

    const cards =
        $$(".confession-card");


    if (!cards.length) {

        return;

    }


    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                card.classList.toggle(
                    "confession-open"
                );


                if (
                    card.classList.contains(
                        "confession-open"
                    )
                ) {

                    createFloatingHeart({

                        startX:
                            card.getBoundingClientRect().left +
                            card.offsetWidth / 2,

                        startY:
                            card.getBoundingClientRect().top

                    });

                }

            }
        );

    });

}


setupConfessionCards();


/* =========================================================
   42 — MEMORY CARD DETAILS
   ========================================================= */

function setupMemoryCards() {

    const cards =
        $$(".memory-card");


    if (!cards.length) {

        return;

    }


    cards.forEach(card => {

        card.addEventListener(
            "dblclick",
            event => {

                event.preventDefault();


                /*
                 * Double tap / double click creates
                 * a slightly bigger heart effect.
                 */

                const rect =
                    card.getBoundingClientRect();


                for (
                    let i = 0;
                    i < 4;
                    i++
                ) {

                    setTimeout(
                        () => {

                            createFloatingHeart({

                                startX:
                                    rect.left +
                                    Math.random() *
                                    rect.width,

                                startY:
                                    rect.top +
                                    rect.height / 2

                            });

                        },
                        i * 120
                    );

                }

            }
        );

    });

}


setupMemoryCards();


/* =========================================================
   43 — SECTION TRACKING
   ========================================================= */

function setupSectionTracking() {

    const sections =
        $$("section[id]");


    if (
        !sections.length ||
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {

                        return;

                    }


                    const id =
                        entry.target.id;


                    App.currentSection =
                        id;


                    document.body.dataset.section =
                        id;

                });

            },
            {

                threshold:
                    0.35

            }
        );


    sections.forEach(section => {

        observer.observe(
            section
        );

    });

}


setupSectionTracking();


/* =========================================================
   44 — SCROLL PROGRESS
   ========================================================= */

function setupScrollProgress() {

    let progressBar =
        $("#scrollProgress");


    /*
     * If the HTML doesn't already contain
     * a progress bar, create one.
     */

    if (!progressBar) {

        progressBar =
            document.createElement(
                "div"
            );


        progressBar.id =
            "scrollProgress";


        progressBar.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.appendChild(
            progressBar
        );

    }


    function updateProgress() {

        const documentHeight =
            document.documentElement
                .scrollHeight;


        const windowHeight =
            window.innerHeight;


        const maxScroll =
            documentHeight -
            windowHeight;


        if (
            maxScroll <= 0
        ) {

            progressBar.style.width =
                "0%";

            return;

        }


        const scrollTop =
            window.scrollY ||
            window.pageYOffset;


        const percentage =
            (
                scrollTop /
                maxScroll
            ) * 100;


        progressBar.style.width =
            `${Math.min(
                100,
                Math.max(
                    0,
                    percentage
                )
            )}%`;

    }


    window.addEventListener(
        "scroll",
        updateProgress,
        {
            passive: true
        }
    );


    updateProgress();

}


setupScrollProgress();


/* =========================================================
   45 — TOP SCROLL BUTTON
   ========================================================= */

function setupBackToTop() {

    let button =
        $("#backToTop");


    /*
     * Don't force one into the page if the
     * HTML already has its own navigation.
     */

    if (!button) {

        button =
            document.createElement(
                "button"
            );


        button.id =
            "backToTop";


        button.className =
            "back-to-top";


        button.type =
            "button";


        button.setAttribute(
            "aria-label",
            "Back to top"
        );


        button.innerHTML =
            `<i class="fa-solid fa-arrow-up"></i>`;


        document.body.appendChild(
            button
        );

    }


    function updateButton() {

        if (
            window.scrollY >
            window.innerHeight * .7
        ) {

            button.classList.add(
                "show"
            );

        } else {

            button.classList.remove(
                "show"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateButton,
        {
            passive: true
        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top:
                    0,

                behavior:
                    "smooth"

            });

        }
    );


    updateButton();

}


setupBackToTop();


/* =========================================================
   46 — RANDOM HEARTS DURING READING
   ========================================================= */

function setupAmbientHeartSystem() {

    let timer = null;


    function start() {

        if (timer) {

            return;

        }


        const delay =
            window.innerWidth < 600
                ? 10000
                : 7500;


        timer =
            setInterval(
                () => {

                    /*
                     * Keep the effect subtle.
                     */

                    if (
                        document.hidden
                    ) {

                        return;

                    }


                    createFloatingHeart();

                },
                delay
            );

    }


    function stop() {

        if (!timer) {

            return;

        }


        clearInterval(
            timer
        );


        timer =
            null;

    }


    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                stop();

            } else {

                start();

            }

        }
    );


    start();

}


setupAmbientHeartSystem();


/* =========================================================
   47 — CLICK HEARTS ANYWHERE
   ========================================================= */

function setupGlobalClickHearts() {

    document.addEventListener(
        "click",
        event => {

            /*
             * Avoid creating extra hearts when
             * clicking buttons that already have
             * special effects.
             */

            const target =
                event.target;


            if (
                target.closest(
                    "button, a, input, audio"
                )
            ) {

                return;

            }


            if (
                document.body.classList.contains(
                    "reduced-motion"
                )
            ) {

                return;

            }


            createClickHeart(
                event
            );

        }
    );

}


setupGlobalClickHearts();


/* =========================================================
   48 — RESIZE HANDLER
   ========================================================= */

let resizeTimer =
    null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    /*
                     * Nothing heavy here.
                     *
                     * This simply lets the next
                     * animation systems know the
                     * viewport changed.
                     */

                    document.body.dataset.viewport =
                        window.innerWidth < 600
                            ? "mobile"
                            : "desktop";

                },
                150
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   49 — INITIAL VIEWPORT STATE
   ========================================================= */

document.body.dataset.viewport =
    window.innerWidth < 600
        ? "mobile"
        : "desktop";


/* =========================================================
   50 — END OF SCRIPT.JS — PART 3
   ========================================================= */

   /* =========================================================
   SIX MONTHS OF US ❤️
   SCRIPT.JS — PART 4
   CINEMATIC INITIALS + PARTICLES + FINAL EFFECTS
   ========================================================= */


/* =========================================================
   51 — INITIALS ELEMENTS
   ========================================================= */

const initialElements = {

    container:
        $("#initials") ||
        $(".initials-container") ||
        $(".initials"),

    v:
        $("#initialV") ||
        $(".initial-v") ||
        $("[data-initial='V']"),

    b:
        $("#initialB") ||
        $(".initial-b") ||
        $("[data-initial='B']"),

    heart:
        $("#initialHeart") ||
        $(".initial-heart")

};


/* =========================================================
   52 — CINEMATIC INITIALS SEQUENCE
   ========================================================= */

function playCinematicInitials() {

    const {
        container,
        v,
        b,
        heart
    } = initialElements;


    if (!container) {

        return;

    }


    /*
     * Reset everything.
     */

    container.classList.remove(
        "initial-animation-started",
        "initial-animation-complete",
        "initial-animation-finished"
    );


    if (v) {

        v.classList.remove(
            "initial-v-show",
            "initial-v-move"
        );

    }


    if (b) {

        b.classList.remove(
            "initial-b-show",
            "initial-b-move"
        );

    }


    if (heart) {

        heart.classList.remove(
            "initial-heart-show",
            "initial-heart-pulse"
        );

    }


    /*
     * Force reflow.
     */

    void container.offsetWidth;


    container.classList.add(
        "initial-animation-started"
    );


    /* ---------------------------------------------
       V APPEARS
    ---------------------------------------------- */

    setTimeout(
        () => {

            if (v) {

                v.classList.add(
                    "initial-v-show"
                );

            }

        },
        100
    );


    /* ---------------------------------------------
       B APPEARS
    ---------------------------------------------- */

    setTimeout(
        () => {

            if (b) {

                b.classList.add(
                    "initial-b-show"
                );

            }

        },
        450
    );


    /* ---------------------------------------------
       V + B MOVE TOGETHER
    ---------------------------------------------- */

    setTimeout(
        () => {

            if (v) {

                v.classList.add(
                    "initial-v-move"
                );

            }


            if (b) {

                b.classList.add(
                    "initial-b-move"
                );

            }

        },
        950
    );


    /* ---------------------------------------------
       HEART APPEARS
    ---------------------------------------------- */

    setTimeout(
        () => {

            if (heart) {

                heart.classList.add(
                    "initial-heart-show"
                );

            }


            createInitialHeartExplosion(
                container
            );

        },
        1450
    );


    /* ---------------------------------------------
       HEARTBEAT
    ---------------------------------------------- */

    setTimeout(
        () => {

            if (heart) {

                heart.classList.add(
                    "initial-heart-pulse"
                );

            }


            container.classList.add(
                "initial-animation-complete"
            );


            createFloatingHeart({

                startX:
                    window.innerWidth / 2,

                startY:
                    window.innerHeight / 2

            });

        },
        2100
    );


    /* ---------------------------------------------
       FINISH
    ---------------------------------------------- */

    setTimeout(
        () => {

            container.classList.add(
                "initial-animation-finished"
            );

        },
        4300
    );

}


/* =========================================================
   53 — INITIAL HEART EXPLOSION
   ========================================================= */

function createInitialHeartExplosion(
    container
) {

    if (!container) {

        return;

    }


    const rect =
        container.getBoundingClientRect();


    const amount =
        window.innerWidth < 600
            ? 12
            : 20;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "click-heart";


        heart.textContent =
            i % 3 === 0
                ? "❤"
                : "✦";


        heart.style.left =
            `${rect.left + rect.width / 2}px`;


        heart.style.top =
            `${rect.top + rect.height / 2}px`;


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            35 +
            Math.random() * 110;


        heart.style.setProperty(
            "--burst-x",
            `${Math.cos(angle) * distance}px`
        );


        heart.style.setProperty(
            "--burst-y",
            `${Math.sin(angle) * distance}px`
        );


        heart.style.fontSize =
            `${8 + Math.random() * 15}px`;


        document.body.appendChild(
            heart
        );


        setTimeout(
            () => {

                heart.remove();

            },
            1200
        );

    }

}


/* =========================================================
   54 — REPLACE BASIC INTRO ANIMATION
   ========================================================= */

function startInitialLettersAnimation() {

    playCinematicInitials();

}


/* =========================================================
   55 — FINAL SURPRISE SYSTEM
   ========================================================= */

function setupFinalSurprise() {

    const openButton =
        $("#finalSurpriseButton");

    const overlay =
        $("#finalSurprise");

    const closeButton =
        $("#closeFinalSurprise");


    if (
        !overlay
    ) {

        return;

    }


    if (openButton) {

        openButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                openFinalSurprise();

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                closeFinalSurprise();

            }
        );

    }


    /*
     * Clicking the dark area outside the card
     * closes the surprise.
     */

    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeFinalSurprise();

            }

        }
    );


    /*
     * Escape key closes it.
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                App.finalSurpriseOpen
            ) {

                closeFinalSurprise();

            }

        }
    );

}


function openFinalSurprise() {

    const overlay =
        $("#finalSurprise");


    if (!overlay) {

        return;

    }


    App.finalSurpriseOpen =
        true;


    overlay.classList.add(
        "open"
    );


    document.body.classList.add(
        "modal-open"
    );


    /*
     * Create the particle shower.
     */

    createFinalSurpriseParticles();


    /*
     * Heart burst.
     */

    setTimeout(
        () => {

            createMassiveHeartBurst();

        },
        250
    );


    /*
     * Soft vibration on mobile.
     */

    if (
        navigator.vibrate
    ) {

        try {

            navigator.vibrate(
                [40, 60, 80]
            );

        } catch (error) {

            /* Ignore vibration errors */

        }

    }

}


function closeFinalSurprise() {

    const overlay =
        $("#finalSurprise");


    if (!overlay) {

        return;

    }


    App.finalSurpriseOpen =
        false;


    overlay.classList.remove(
        "open"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   56 — FINAL SURPRISE PARTICLES
   ========================================================= */

function createFinalSurpriseParticles() {

    const container =
        $("#finalSurpriseParticles");


    if (!container) {

        return;

    }


    /*
     * Clear previous particles.
     */

    container.innerHTML =
        "";


    const amount =
        window.innerWidth < 600
            ? 35
            : 65;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "surprise-particle";


        const size =
            2 +
            Math.random() * 5;


        const duration =
            3 +
            Math.random() * 4;


        const horizontal =
            -150 +
            Math.random() * 300;


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.setProperty(
            "--particle-size",
            `${size}px`
        );


        particle.style.setProperty(
            "--particle-duration",
            `${duration}s`
        );


        particle.style.setProperty(
            "--particle-x",
            `${horizontal}px`
        );


        /*
         * Alternate between pink and
         * white using CSS variables.
         */

        if (
            i % 3 === 0
        ) {

            particle.style.setProperty(
                "--particle-color",
                "rgba(255,255,255,.8)"
            );

        } else {

            particle.style.setProperty(
                "--particle-color",
                "rgba(255,92,157,.8)"
            );

        }


        container.appendChild(
            particle
        );


        setTimeout(
            () => {

                particle.remove();

            },
            (duration + 1) * 1000
        );

    }

}


/* =========================================================
   57 — MASSIVE HEART BURST
   ========================================================= */

function createMassiveHeartBurst() {

    const amount =
        window.innerWidth < 600
            ? 22
            : 40;


    const centerX =
        window.innerWidth / 2;


    const centerY =
        window.innerHeight / 2;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "click-heart";


        heart.textContent =
            Math.random() > .25
                ? "♥"
                : "✦";


        heart.style.left =
            `${centerX}px`;


        heart.style.top =
            `${centerY}px`;


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            80 +
            Math.random() * 260;


        heart.style.setProperty(
            "--burst-x",
            `${Math.cos(angle) * distance}px`
        );


        heart.style.setProperty(
            "--burst-y",
            `${Math.sin(angle) * distance}px`
        );


        heart.style.fontSize =
            `${10 + Math.random() * 20}px`;


        document.body.appendChild(
            heart
        );


        setTimeout(
            () => {

                heart.remove();

            },
            1200
        );

    }

}


/* =========================================================
   58 — FINAL SECTION OBSERVER
   ========================================================= */

function setupFinalSectionAnimation() {

    const finale =
        $("#finale");


    if (
        !finale ||
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        finale.classList.add(
                            "finale-visible"
                        );


                        createFinalAmbientStars();


                        observer.unobserve(
                            finale
                        );

                    }
                );

            },
            {

                threshold:
                    .25

            }
        );


    observer.observe(
        finale
    );

}


setupFinalSectionAnimation();


/* =========================================================
   59 — FINAL AMBIENT STARS
   ========================================================= */

function createFinalAmbientStars() {

    const container =
        $("#finalStarField");


    if (!container) {

        return;

    }


    /*
     * Avoid creating them twice.
     */

    if (
        container.dataset.created ===
        "true"
    ) {

        return;

    }


    container.dataset.created =
        "true";


    const amount =
        window.innerWidth < 600
            ? 20
            : 35;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const star =
            document.createElement(
                "span"
            );


        star.className =
            "final-star";


        star.textContent =
            i % 5 === 0
                ? "✦"
                : "·";


        star.style.position =
            "absolute";


        star.style.left =
            `${Math.random() * 100}%`;


        star.style.top =
            `${Math.random() * 100}%`;


        star.style.color =
            i % 4 === 0
                ? "rgba(255,92,157,.8)"
                : "rgba(255,255,255,.5)";


        star.style.fontSize =
            `${5 + Math.random() * 8}px`;


        star.style.opacity =
            `${.25 + Math.random() * .6}`;


        star.style.animation =
            `finalStarTwinkle ${
                2 + Math.random() * 4
            }s ease-in-out infinite`;


        star.style.animationDelay =
            `${Math.random() * 3}s`;


        container.appendChild(
            star
        );

    }

}


/* =========================================================
   60 — DYNAMIC FINAL STAR ANIMATION
   ========================================================= */

if (
    !document.getElementById(
        "finalStarAnimation"
    )
) {

    const style =
        document.createElement(
            "style"
        );


    style.id =
        "finalStarAnimation";


    style.textContent = `

        @keyframes finalStarTwinkle {

            0%,
            100% {

                transform:
                    scale(.6);

                opacity:
                    .2;

            }

            50% {

                transform:
                    scale(1.5);

                opacity:
                    .9;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   61 — FINAL INITIALS INTERACTION
   ========================================================= */

function setupFinalInitialInteraction() {

    const initials =
        $("#finalInitials");


    if (!initials) {

        return;

    }


    initials.addEventListener(
        "click",
        () => {

            initials.classList.remove(
                "final-initials-active"
            );


            void initials.offsetWidth;


            initials.classList.add(
                "final-initials-active"
            );


            createMassiveHeartBurst();

        }
    );

}


setupFinalInitialInteraction();


/* =========================================================
   62 — FINAL HEART CLICK
   ========================================================= */

function setupFinalHeartInteraction() {

    const heart =
        $("#finalHeart");


    if (!heart) {

        return;

    }


    heart.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            createMassiveHeartBurst();


            createFloatingHeart({

                startX:
                    window.innerWidth / 2,

                startY:
                    window.innerHeight / 2

            });

        }
    );

}


setupFinalHeartInteraction();


/* =========================================================
   63 — PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            /*
             * Pause decorative effects.
             *
             * We don't force-stop the music because
             * browser behavior differs between devices.
             */

            document.body.classList.add(
                "page-hidden"
            );

        } else {

            document.body.classList.remove(
                "page-hidden"
            );

        }

    }
);


/* =========================================================
   64 — FINAL SURPRISE INITIALIZATION
   ========================================================= */

setupFinalSurprise();


/* =========================================================
   65 — END OF SCRIPT.JS — PART 4
   ========================================================= */



/* =========================================================
   SIX MONTHS OF US ❤️
   SCRIPT.JS — PART 5
   FINAL POLISH + SAFETY + MOBILE + CLEANUP
   ========================================================= */


/* =========================================================
   66 — DYNAMIC INITIAL V ❤️ B CSS
   ========================================================= */

function injectInitialAnimationCSS() {

    if (
        document.getElementById(
            "dynamicInitialAnimation"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "dynamicInitialAnimation";


    style.textContent = `

        /* -----------------------------------------
           INITIAL V + B
        ------------------------------------------ */

        .initial-v,
        .initial-b {

            opacity: 0;

            transform:
                translateY(25px)
                scale(.85);

            transition:
                opacity .8s
                cubic-bezier(.2,.7,.2,1),

                transform 1s
                cubic-bezier(.2,.7,.2,1);

        }


        .initial-v-show,
        .initial-b-show {

            opacity: 1;

            transform:
                translateY(0)
                scale(1);

        }


        .initial-v-move {

            transform:
                translateX(45px)
                scale(.9);

        }


        .initial-b-move {

            transform:
                translateX(-45px)
                scale(.9);

        }


        .initial-heart {

            opacity: 0;

            transform:
                translate(-50%,-50%)
                scale(.1)
                rotate(-20deg);

            transition:
                opacity .6s ease,

                transform 1s
                cubic-bezier(.17,.67,.25,1.3);

        }


        .initial-heart-show {

            opacity: 1;

            transform:
                translate(-50%,-50%)
                scale(1)
                rotate(0deg);

        }


        .initial-heart-pulse {

            animation:
                cinematicHeartPulse
                1.5s
                ease-in-out
                infinite;

        }


        @keyframes cinematicHeartPulse {

            0%,
            100% {

                transform:
                    translate(-50%,-50%)
                    scale(1);

            }

            25% {

                transform:
                    translate(-50%,-50%)
                    scale(1.18);

            }

            45% {

                transform:
                    translate(-50%,-50%)
                    scale(.96);

            }

            65% {

                transform:
                    translate(-50%,-50%)
                    scale(1.10);

            }

        }


        /* -----------------------------------------
           FINAL INITIALS
        ------------------------------------------ */

        .final-initials-active
        .final-letter {

            animation:
                finalLetterGlow
                1.2s
                ease-in-out;

        }


        .final-initials-active
        .final-heart span {

            animation:
                finalHeartExplosion
                1.3s
                ease-in-out;

        }


        @keyframes finalLetterGlow {

            0%,
            100% {

                filter:
                    brightness(1);

            }

            50% {

                filter:
                    brightness(1.8);

                text-shadow:
                    0 0 40px
                    rgba(255,92,157,.65);

            }

        }


        @keyframes finalHeartExplosion {

            0% {

                transform:
                    scale(1);

            }

            25% {

                transform:
                    scale(1.45);

            }

            50% {

                transform:
                    scale(.9);

            }

            75% {

                transform:
                    scale(1.25);

            }

            100% {

                transform:
                    scale(1);

            }

        }


        /* -----------------------------------------
           SCROLL PROGRESS
        ------------------------------------------ */

        #scrollProgress {

            position:
                fixed;

            left:
                0;

            top:
                0;

            z-index:
                9998;

            width:
                0%;

            height:
                2px;

            background:
                linear-gradient(
                    90deg,
                    #ff5c9d,
                    #9b7cff
                );

            box-shadow:
                0 0 10px
                rgba(255,92,157,.45);

            pointer-events:
                none;

            transition:
                width .08s linear;

        }


        /* -----------------------------------------
           BACK TO TOP
        ------------------------------------------ */

        .back-to-top {

            position:
                fixed;

            right:
                20px;

            bottom:
                20px;

            z-index:
                9000;

            width:
                44px;

            height:
                44px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border:
                1px solid
                rgba(255,255,255,.12);

            border-radius:
                50%;

            background:
                rgba(15,15,25,.75);

            backdrop-filter:
                blur(12px);

            color:
                rgba(255,255,255,.65);

            cursor:
                pointer;

            opacity:
                0;

            visibility:
                hidden;

            transform:
                translateY(15px);

            transition:
                .35s ease;

        }


        .back-to-top.show {

            opacity:
                1;

            visibility:
                visible;

            transform:
                translateY(0);

        }


        .back-to-top:hover {

            color:
                #ff8ab9;

            border-color:
                rgba(255,92,157,.30);

            transform:
                translateY(-4px);

        }


        /* -----------------------------------------
           AUDIO HINT
        ------------------------------------------ */

        .audio-hint {

            position:
                fixed;

            left:
                50%;

            bottom:
                30px;

            z-index:
                99999;

            display:
                flex;

            align-items:
                center;

            gap:
                10px;

            padding:
                12px 18px;

            border:
                1px solid
                rgba(255,92,157,.20);

            border-radius:
                999px;

            background:
                rgba(10,10,18,.90);

            backdrop-filter:
                blur(15px);

            box-shadow:
                0 15px 45px
                rgba(0,0,0,.30);

            opacity:
                0;

            transform:
                translate(-50%,20px);

            pointer-events:
                none;

            transition:
                .4s ease;

        }


        .audio-hint.show {

            opacity:
                1;

            transform:
                translate(-50%,0);

        }


        .audio-hint span {

            color:
                #ff5c9d;

        }


        .audio-hint p {

            margin:
                0;

            color:
                rgba(255,255,255,.70);

            font-size:
                11px;

        }


        /* -----------------------------------------
           REDUCED MOTION
        ------------------------------------------ */

        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {

            animation-duration:
                .001ms !important;

            animation-iteration-count:
                1 !important;

            scroll-behavior:
                auto !important;

            transition-duration:
                .001ms !important;

        }


        /* -----------------------------------------
           IMAGE ERROR
        ------------------------------------------ */

        .memory-image.image-error {

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            min-height:
                180px;

            background:
                rgba(255,255,255,.035);

        }


        .memory-image.image-error::after {

            content:
                "❤️";

            font-size:
                30px;

            opacity:
                .4;

        }


        /* -----------------------------------------
           AUDIO PLAYING EFFECT
        ------------------------------------------ */

        body.voice-playing
        .voice-wave {

            border-color:
                rgba(255,92,157,.18);

        }


        body.music-playing
        .music-indicator {

            opacity:
                1;

        }


        /* -----------------------------------------
           MOBILE
        ------------------------------------------ */

        @media (max-width:600px) {

            .initial-v-move {

                transform:
                    translateX(28px)
                    scale(.88);

            }


            .initial-b-move {

                transform:
                    translateX(-28px)
                    scale(.88);

            }


            .back-to-top {

                right:
                    14px;

                bottom:
                    14px;

                width:
                    40px;

                height:
                    40px;

            }


            .audio-hint {

                width:
                    max-content;

                max-width:
                    calc(100% - 30px);

                text-align:
                    center;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


injectInitialAnimationCSS();


/* =========================================================
   67 — SAFETY CHECK FOR AUDIO
   ========================================================= */

function validateAudioSources() {

    const audioElements =
        $$("audio");


    audioElements.forEach(
        audio => {

            audio.addEventListener(
                "error",
                () => {

                    console.warn(
                        "Audio could not be loaded:",
                        audio.id ||
                        "unnamed audio"
                    );

                }
            );

        }
    );

}


validateAudioSources();


/* =========================================================
   68 — PREVENT BROKEN INTERNAL LINKS
   ========================================================= */

function setupSafeLinks() {

    const links =
        $$("a[href]");


    links.forEach(
        link => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                !href ||
                href === "#"
            ) {

                return;

            }


            /*
             * Only handle internal IDs.
             */

            if (
                !href.startsWith("#")
            ) {

                return;

            }


            const target =
                $(href);


            if (!target) {

                /*
                 * Prevent a missing section
                 * from jumping the page.
                 */

                link.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                    }
                );

            }

        }
    );

}


setupSafeLinks();


/* =========================================================
   69 — PREVENT DOUBLE TAP ZOOM ON SPECIAL ELEMENTS
   ========================================================= */

function setupTouchProtection() {

    const specialElements =
        $$(
            ".final-heart, " +
            ".initial-heart, " +
            ".final-surprise-button, " +
            ".secret-button"
        );


    specialElements.forEach(
        element => {

            element.addEventListener(
                "touchend",
                event => {

                    event.stopPropagation();

                },
                {
                    passive: true
                }
            );

        }
    );

}


setupTouchProtection();


/* =========================================================
   70 — PAGE LOAD SAFETY
   ========================================================= */

window.addEventListener(
    "error",
    event => {

        /*
         * Don't allow one optional image,
         * font or external resource to destroy
         * the experience.
         */

        console.warn(
            "Resource warning:",
            event.message ||
            "Unknown resource"
        );

    }
);


/* =========================================================
   71 — UNHANDLED PROMISE SAFETY
   ========================================================= */

window.addEventListener(
    "unhandledrejection",
    event => {

        console.warn(
            "Handled website promise warning:",
            event.reason
        );

        /*
         * Prevent an unhandled audio promise
         * from appearing as a fatal website error.
         */

        event.preventDefault();

    }
);


/* =========================================================
   72 — FINAL PAGE INITIALIZATION
   ========================================================= */

function finalizeWebsite() {

    /*
     * Mark website as ready.
     */

    document.body.classList.add(
        "website-ready"
    );


    /*
     * Remove any temporary initialization
     * class after the page has settled.
     */

    setTimeout(
        () => {

            document.body.classList.add(
                "website-settled"
            );

        },
        1800
    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        finalizeWebsite,
        {
            once: true
        }
    );

} else {

    finalizeWebsite();

}


/* =========================================================
   73 — DEBUG INFORMATION
   ========================================================= */

function showDevelopmentInfo() {

    /*
     * Only show this in the console.
     *
     * It doesn't appear on the website.
     */

    console.log(
        "%c❤️ Six Months of Us ❤️",
        "font-size:20px;font-weight:bold;color:#ff5c9d;"
    );


    console.log(
        "V ❤️ B — always."
    );


    console.log(
        "Website systems initialized."
    );

}


showDevelopmentInfo();


/* =========================================================
   74 — FINAL CLEANUP
   ========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        /*
         * Stop decorative intervals.
         *
         * Audio is handled naturally by
         * the browser when the page closes.
         */

        document
            .querySelectorAll(
                ".floating-heart, .click-heart, .surprise-particle"
            )
            .forEach(
                element => {

                    element.remove();

                }
            );

    }
);


/* =========================================================
   75 — SCRIPT COMPLETE ❤️
   ========================================================= */

console.log(
    "%cV ❤️ B",
    "font-size:32px;color:#ff5c9d;font-weight:bold;"
);

console.log(
    "%cSix months. One story. A lifetime ahead. ❤️",
    "font-size:14px;color:#ffffff;"
);


/* =========================================================
   END OF SCRIPT.JS
   ========================================================= */


