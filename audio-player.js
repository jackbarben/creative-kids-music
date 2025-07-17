class AudioPlayer {
    constructor(containerId, tracks) {
        this.container = document.getElementById(containerId);
        this.tracks = tracks;
        this.currentTrackIndex = 0;
        this.audio = new Audio();
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = `
            <div class="audio-player">
                <div class="track-info">
                    <h3 class="track-title"></h3>
                    <p class="track-artist"></p>
                </div>
                
                <div class="audio-controls">
                    <button class="prev-track" aria-label="Previous track">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                    </button>
                    
                    <button class="play-pause" aria-label="Play/Pause">
                        <svg class="play-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="pause-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    </button>
                    
                    <button class="next-track" aria-label="Next track">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="progress-container">
                    <span class="time-current">0:00</span>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="time-total">0:00</span>
                </div>
                
                <div class="track-dots">
                    ${this.tracks.map((_, index) => 
                        `<span class="track-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        this.cacheElements();
        this.bindEvents();
        this.loadTrack(0);
    }
    
    cacheElements() {
        this.elements = {
            playPause: this.container.querySelector('.play-pause'),
            playIcon: this.container.querySelector('.play-icon'),
            pauseIcon: this.container.querySelector('.pause-icon'),
            prevTrack: this.container.querySelector('.prev-track'),
            nextTrack: this.container.querySelector('.next-track'),
            trackTitle: this.container.querySelector('.track-title'),
            trackArtist: this.container.querySelector('.track-artist'),
            progressBar: this.container.querySelector('.progress-bar'),
            progressFill: this.container.querySelector('.progress-fill'),
            timeCurrent: this.container.querySelector('.time-current'),
            timeTotal: this.container.querySelector('.time-total'),
            trackDots: this.container.querySelectorAll('.track-dot')
        };
    }
    
    bindEvents() {
        this.elements.playPause.addEventListener('click', () => this.togglePlayPause());
        this.elements.prevTrack.addEventListener('click', () => this.previousTrack());
        this.elements.nextTrack.addEventListener('click', () => this.nextTrack());
        
        this.elements.progressBar.addEventListener('click', (e) => {
            const rect = this.elements.progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });
        
        this.elements.trackDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.loadTrack(index));
        });
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.audio.addEventListener('ended', () => this.nextTrack());
    }
    
    loadTrack(index) {
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        
        this.audio.src = track.src;
        this.elements.trackTitle.textContent = track.title;
        this.elements.trackArtist.textContent = track.artist || 'Creative Kids Music';
        
        this.updateDots();
        
        if (this.isPlaying) {
            this.audio.play();
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
        this.elements.playIcon.style.display = 'none';
        this.elements.pauseIcon.style.display = 'block';
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.elements.playIcon.style.display = 'block';
        this.elements.pauseIcon.style.display = 'none';
    }
    
    previousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
    }
    
    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
    }
    
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.elements.progressFill.style.width = percent + '%';
        this.elements.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateTimeDisplay() {
        this.elements.timeTotal.textContent = this.formatTime(this.audio.duration);
    }
    
    updateDots() {
        this.elements.trackDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentTrackIndex);
        });
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// CSS for the audio player
const audioPlayerStyles = `
    .audio-player {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        margin: 0 auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
    }
    
    .track-info {
        text-align: center;
        margin-bottom: 25px;
    }
    
    .track-title {
        font-family: 'Quicksand', sans-serif;
        font-size: 1.4rem;
        color: #5a7c3a;
        margin-bottom: 5px;
        font-weight: 600;
    }
    
    .track-artist {
        color: #7a9b5a;
        font-size: 1rem;
        margin: 0;
    }
    
    .audio-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-bottom: 25px;
    }
    
    .audio-controls button {
        background: none;
        border: none;
        color: #7a9b5a;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 10px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .audio-controls button:hover {
        background: rgba(122, 155, 90, 0.1);
        transform: scale(1.1);
    }
    
    .play-pause {
        background: #7a9b5a !important;
        color: white !important;
        width: 60px;
        height: 60px;
    }
    
    .play-pause:hover {
        background: #6a8a4a !important;
    }
    
    .progress-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .progress-bar {
        flex: 1;
        height: 6px;
        background: #e0e0e0;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: #7a9b5a;
        border-radius: 3px;
        width: 0%;
        transition: width 0.1s ease;
    }
    
    .time-current, .time-total {
        font-size: 0.9rem;
        color: #5a5a5a;
        min-width: 40px;
    }
    
    .track-dots {
        display: flex;
        justify-content: center;
        gap: 8px;
    }
    
    .track-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #e0e0e0;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .track-dot:hover {
        background: #b0b0b0;
    }
    
    .track-dot.active {
        background: #7a9b5a;
        transform: scale(1.2);
    }
    
    @media (max-width: 600px) {
        .audio-player {
            padding: 20px;
        }
        
        .track-title {
            font-size: 1.2rem;
        }
        
        .audio-controls {
            gap: 15px;
        }
        
        .play-pause {
            width: 50px;
            height: 50px;
        }
    }
`;

// Add styles to document
if (!document.getElementById('audio-player-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'audio-player-styles';
    styleSheet.textContent = audioPlayerStyles;
    document.head.appendChild(styleSheet);
}