/* ==========================================
   1. ELEMENT SELECTORS & SAFEGUARDS
   ========================================== */
const envelope = document.getElementById("envelope");
const landing = document.getElementById("landing");
const home = document.getElementById("home");
const exploreBtn = document.getElementById("exploreBtn");
const glow = document.querySelector(".cursor-glow");

/* ==========================================
   2. ENVELOPE OPEN & HOME TRANSITION
   ========================================== */
if (envelope) {
    envelope.addEventListener("click", () => {
        envelope.classList.add("open");

        // Optional: play music automatically if browser permissions allow
        if (music && music.paused) {
            music.play().then(() => { musicBtn.innerHTML = "⏸"; }).catch(() => {});
        }

        setTimeout(() => {
            landing.style.opacity = "0";
            setTimeout(() => {
                landing.style.display = "none";
                home.classList.remove("hidden");
                document.body.style.overflow = "auto";
            }, 700);
        }, 1700);
    });
}

/* ==========================================
   3. EXPLORE BUTTON NAVIGATION
   ========================================== */
if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
        const memories = document.getElementById("memories");
        if (memories) {
            memories.scrollIntoView({ behavior: "smooth" });
        }
    });
}

/* ==========================================
   4. LIGHTBOX CONTROLS & AUTOMATED INTERACTIVE ALBUMS
   ========================================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxVideo = document.getElementById("lightbox-video");
const closeLightbox = document.querySelector(".close-lightbox");
const tinVideos = document.querySelectorAll(".tin-photo video");

// 📂 Folder structure configuration (Just specify how many photos are in each folder!)
const albumConfig = {
    "first-meet": { title: "First Meet ❤️", folder: "memories/firstmeet", totalPhotos: 10 },
    "first-date": { title: "First Date 💖", folder: "memories/firstdate", totalPhotos: 10 },
    "adventure":  { title: "Adventure 🌸",  folder: "memories/adventure",  totalPhotos: 10 },
    "your-smile": { title: "Your Smile 😊", folder: "memories/yoursmile", totalPhotos: 10 },
    "forever":    { title: "Forever 💍",    folder: "memories/forever",    totalPhotos: 10 },
    "always":     { title: "Always ❤️",     folder: "memories/always",     totalPhotos: 10 }
};

const coversView = document.getElementById("albums-cover-view");
const innerView = document.getElementById("inner-album-view");
const innerGrid = document.getElementById("inner-photos-grid");
const currentAlbumTitle = document.getElementById("current-album-title");
const backBtn = document.getElementById("backToAlbumsBtn");

// Function to handle opening the lightbox securely
function openLightbox(type, source) {
    if (!lightbox) return;
    lightbox.style.display = "flex";
    
    if (type === "image" && lightboxImg && lightboxVideo) {
        lightboxVideo.style.display = "none";
        lightboxVideo.pause();
        lightboxImg.style.display = "block";
        lightboxImg.src = source;
    } else if (type === "video" && lightboxVideo && lightboxImg) {
        lightboxImg.style.display = "none";
        lightboxVideo.style.display = "block";
        lightboxVideo.src = source;
        lightboxVideo.play().catch(err => console.log(err));
    }
}

function closeAndResetLightbox() {
    if (!lightbox) return;
    lightbox.style.display = "none";
    if (lightboxVideo) { lightboxVideo.pause(); lightboxVideo.src = ""; }
    if (lightboxImg) { lightboxImg.src = ""; }
}

// 📸 Handle Album Cover clicks & AUTO-GENERATING the polaroid images from folders
document.querySelectorAll(".album-cover").forEach(cover => {
    cover.addEventListener("click", () => {
        const albumKey = cover.getAttribute("data-album");
        const config = albumConfig[albumKey];
        
        if (config) {
            currentAlbumTitle.textContent = config.title;
            innerGrid.innerHTML = ""; // Clear existing layout safely
            
            // 🔄 Loop automatically reads folder paths up to your totalPhotos count
            for (let i = 1; i <= config.totalPhotos; i++) {
                const photoSrc = `${config.folder}/${i}.jpg`; // e.g. "memories/first-meet/1.jpg"
                
                const photoCard = document.createElement("div");
                photoCard.classList.add("polaroid");
                
                // Charmingly random slight polaroid rotation angles
                const rot = (Math.random() * 6 - 3).toFixed(1);
                photoCard.style.transform = `rotate(${rot}deg)`;
                
                photoCard.innerHTML = `
                    <img src="${photoSrc}" alt="Memory ${i}">
                    <p>Memory #${i} ✨</p>
                `;
                
                // Fullscreen click zoom engine placement
                photoCard.querySelector("img").addEventListener("click", () => {
                    openLightbox("image", photoSrc);
                });
                
                innerGrid.appendChild(photoCard);
            }
            
            // Layout views swapping panel actions
            if (coversView) coversView.style.display = "none";
            if (innerView) innerView.classList.add("show-album-container");
            
            document.getElementById("memories").scrollIntoView({ behavior: "smooth" });
        }
    });
});

// ⬅️ Back Button Navigation Logic (Cleaned up to prevent distortion crashing)
if (backBtn) {
    backBtn.addEventListener("click", () => {
        if (innerView) innerView.classList.remove("show-album-container");
        if (coversView) coversView.style.display = ""; // Empty string drops inline styling to revert to CSS perfectly!
    });
}

// 🎬 Vintage Tin Video listeners
tinVideos.forEach((vid) => {
    vid.addEventListener("click", (e) => {
        e.stopPropagation();
        const videoSrc = vid.querySelector("source") ? vid.querySelector("source").src : vid.src;
        openLightbox("video", videoSrc);
    });
});

if (closeLightbox) closeLightbox.addEventListener("click", closeAndResetLightbox);
if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeAndResetLightbox();
    });
}
/* ==========================================
   5. TYPEWRITER LETTER (SCRAPBOOK CONTENT)
   ========================================== */
const letterText = `Hi Adii,
Happy Monthsary,

I thank God every day for giving me someone as caring, understanding, and supportive as you. You make my life brighter and my heart happier. You make my life better in so many ways. I’m truly grateful that He gave you to me. 

I love you always Adii❤️

`;

const typingText = document.getElementById("typing-text");
let charIndex = 0;
let hasStartedTyping = false;

function typeLetter() {
    if (typingText && charIndex < letterText.length) {
        if (letterText.charAt(charIndex) === "\n") {
            typingText.innerHTML += "<br>";
        } else {
            typingText.innerHTML += letterText.charAt(charIndex);
        }
        charIndex++;
        setTimeout(typeLetter, 40);
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasStartedTyping) {
            hasStartedTyping = true;
            typingText.innerHTML = "";
            typeLetter();
        }
    });
}, { threshold: 0.15 });

const letterSection = document.getElementById("letter");
if (letterSection) {
    observer.observe(letterSection);
}

/* ==========================================
   6. MUSIC PLAYER CONTROLS
   ========================================== */
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

if (musicBtn && music) {
    musicBtn.addEventListener("click", async () => {
        if (music.paused) {
            try {
                await music.play();
                musicBtn.innerHTML = "⏸";
            } catch(err) {
                console.log("Music play blocked: ", err);
            }
        } else {
            music.pause();
            musicBtn.innerHTML = "▶";
        }
    });
}

/* ==========================================
   7. BACKGROUND VISUAL EFFECTS (UNIFIED)
   ========================================== */
// FIXED: Combined your duplicate functions into one high-performance system
function createFloatingHeart() {
    const heart = document.createElement("div");
    // Alternates between the floating styles in your CSS
    heart.classList.add(Math.random() > 0.5 ? "heart-float" : "heart");
    heart.innerHTML = Math.random() > 0.5 ? "❤️" : "💖";
    
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.bottom = "-10vh";
    heart.style.fontSize = Math.random() * 15 + 15 + "px";
    heart.style.animationDuration = (Math.random() * 4 + 4) + "s";
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
}
setInterval(createFloatingHeart, 400);

function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    const petals = ["🌸", "🌹", "💮"];
    petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (Math.random() * 4 + 4) + "s";
    petal.style.fontSize = (Math.random() * 10 + 16) + "px";

    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 8000);
}
setInterval(createPetal, 450);

// Sparkle Trailing Effect
document.addEventListener("mousemove", (e) => {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.innerHTML = "✨";
    sparkle.style.left = e.clientX + "px";
    sparkle.style.top = e.clientY + "px";

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
});

// Cursor Glow Tracker (FIXED: Added protective if statement)
document.addEventListener("mousemove", (e) => {
    if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    }
});

function finalMessage() {
    const finalMsg = document.getElementById("finalMsg");
    if (finalMsg) finalMsg.style.display = "block";
}

// Map the tin container vinyl directly to your background music handler
const tinVinyl = document.getElementById("tinVinyl");
if (tinVinyl && music) {
    tinVinyl.addEventListener("click", () => {
        if (music.paused) {
            music.play().then(() => { musicBtn.innerHTML = "⏸"; }).catch(() => {});
        } else {
            music.pause();
            musicBtn.innerHTML = "▶";
        }
    });
}

// 🏍️ "Click to your baby boy" Complete Interactive Engine Configuration
const revealBtn = document.getElementById("revealMotorbikeBtn");
const videoPanel = document.getElementById("motorbikeVideoPanel");
const logoOverlay = document.getElementById("videoLogoOverlay");
const motorbikeVid = document.getElementById("inlineMotorbikeVideo");
const exitVideoBtn = document.getElementById("exitMotorbikeVideoBtn");

// Step 1: Click "Click to your baby boy" to make the portrait layout area reveal
if (revealBtn && videoPanel) {
    revealBtn.addEventListener("click", () => {
        revealBtn.style.display = "none";
        videoPanel.classList.remove("hidden-video-panel");
        videoPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

// Step 2: Click the clapperboard logo layer to hide it and start the playback frame
if (logoOverlay && motorbikeVid) {
    logoOverlay.addEventListener("click", () => {
        logoOverlay.style.opacity = "0";
        logoOverlay.style.visibility = "hidden"; // Removes it fully from block view
        
        motorbikeVid.controls = true;
        motorbikeVid.play().catch(err => console.log(err));
    });
}

// Step 3: ⬅️ Click Exit Video Button to turn everything off and reset back to normal
if (exitVideoBtn && videoPanel && revealBtn) {
    exitVideoBtn.addEventListener("click", () => {
        motorbikeVid.pause();
        motorbikeVid.currentTime = 0; 
        motorbikeVid.controls = false; 
        
        // Restore overlay clapperboard properties instantly
        logoOverlay.style.opacity = "1";
        logoOverlay.style.visibility = "visible";
        
        videoPanel.classList.add("hidden-video-panel");
        revealBtn.style.display = "inline-block";
        
        document.getElementById("motorbike-surprise").scrollIntoView({ behavior: "smooth" });
    });
}