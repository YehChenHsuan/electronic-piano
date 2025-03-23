document.addEventListener('DOMContentLoaded', function() {
    // 定義鋼琴音符與鍵盤
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // 中文音符名稱
    const noteNamesChinese = {
        'C': '多', 'C#': '升多', 'D': '雷', 'D#': '升雷', 'E': '咪',
        'F': '發', 'F#': '升發', 'G': '索', 'G#': '升索', 'A': '拉',
        'A#': '升拉', 'B': '西'
    };
    
    // 音符與對應鍵盤
    const keyMapping = {
        'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
        'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
        'u': 'A#', 'j': 'B', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
        'p': 'D#5', ';': 'E5'
    };
    
    // Tone.js 合成器
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    
    // 初始八度
    let currentOctave = 4;
    
    // 音量控制
    const volumeControl = document.getElementById('volume');
    volumeControl.addEventListener('input', function() {
        synth.volume.value = Tone.gainToDb(parseFloat(this.value));
    });
    
    // 八度控制
    const octaveDown = document.getElementById('octave-down');
    const octaveUp = document.getElementById('octave-up');
    const currentOctaveDisplay = document.getElementById('current-octave');
    
    octaveDown.addEventListener('click', function() {
        if (currentOctave > 1) {
            currentOctave--;
            updateOctaveDisplay();
            renderPiano();
        }
    });
    
    octaveUp.addEventListener('click', function() {
        if (currentOctave < 7) {
            currentOctave++;
            updateOctaveDisplay();
            renderPiano();
        }
    });
    
    function updateOctaveDisplay() {
        currentOctaveDisplay.textContent = `當前八度: ${currentOctave}`;
    }
    
    // 建立鋼琴鍵盤
    const pianoElement = document.getElementById('piano');
    
    function renderPiano() {
        pianoElement.innerHTML = '';
        
        // 建立兩個八度的鍵盤
        for (let octaveOffset = 0; octaveOffset < 2; octaveOffset++) {
            const octave = currentOctave + octaveOffset;
            
            whiteKeys.forEach((note, i) => {
                const noteWithOctave = `${note}${octave}`;
                const keyElement = document.createElement('div');
                keyElement.className = 'key white-key';
                keyElement.dataset.note = noteWithOctave;
                
                // 為中央C添加標記
                if (note === 'C' && octave === 4) {
                    keyElement.style.borderLeft = '2px solid #ff5555';
                }
                
                // 添加音符標籤
                const keyLabel = document.createElement('div');
                keyLabel.className = 'key-label';
                
                // 查找對應的鍵盤鍵
                let keyboardKey = null;
                for (const [key, value] of Object.entries(keyMapping)) {
                    if (value === noteWithOctave || value === note) {
                        keyboardKey = key.toUpperCase();
                        break;
                    }
                }
                
                if (keyboardKey) {
                    keyLabel.textContent = keyboardKey;
                    keyElement.appendChild(keyLabel);
                }
                
                // 添加音符名稱
                const noteLabel = document.createElement('div');
                noteLabel.className = 'note-label';
                noteLabel.textContent = `${noteNamesChinese[note]}`;
                keyElement.appendChild(noteLabel);
                
                pianoElement.appendChild(keyElement);
                
                // 監聽點擊事件
                keyElement.addEventListener('mousedown', function() {
                    playNote(noteWithOctave);
                    this.classList.add('active');
                });
                
                keyElement.addEventListener('mouseup', function() {
                    this.classList.remove('active');
                });
                
                keyElement.addEventListener('mouseleave', function() {
                    this.classList.remove('active');
                });
            });
        }
        
        // 添加黑鍵
        const whiteKeyElements = document.querySelectorAll('.white-key');
        let blackKeyIndex = 0;
        
        for (let octaveOffset = 0; octaveOffset < 2; octaveOffset++) {
            const octave = currentOctave + octaveOffset;
            
            whiteKeys.forEach((note, i) => {
                const nextNote = whiteKeys[(i + 1) % 7];
                
                if (note !== 'E' && note !== 'B') {
                    const blackNote = blackKeys[blackKeyIndex];
                    const blackNoteWithOctave = `${blackNote}${octave}`;
                    blackKeyIndex = (blackKeyIndex + 1) % blackKeys.length;
                    
                    const blackKeyElement = document.createElement('div');
                    blackKeyElement.className = 'key black-key';
                    blackKeyElement.dataset.note = blackNoteWithOctave;
                    
                    // 計算黑鍵位置
                    const whiteKeyWidth = whiteKeyElements[0].offsetWidth;
                    const position = (i + octaveOffset * 7) * whiteKeyWidth + (whiteKeyWidth * 0.7);
                    blackKeyElement.style.left = `${position}px`;
                    
                    // 添加音符標籤
                    const keyLabel = document.createElement('div');
                    keyLabel.className = 'key-label';
                    
                    // 查找對應的鍵盤鍵
                    let keyboardKey = null;
                    for (const [key, value] of Object.entries(keyMapping)) {
                        if (value === blackNoteWithOctave || value === blackNote) {
                            keyboardKey = key.toUpperCase();
                            break;
                        }
                    }
                    
                    if (keyboardKey) {
                        keyLabel.textContent = keyboardKey;
                        blackKeyElement.appendChild(keyLabel);
                    }
                    
                    // 添加音符名稱
                    const noteLabel = document.createElement('div');
                    noteLabel.className = 'note-label';
                    noteLabel.textContent = `${noteNamesChinese[blackNote]}`;
                    blackKeyElement.appendChild(noteLabel);
                    
                    pianoElement.appendChild(blackKeyElement);
                    
                    // 監聽點擊事件
                    blackKeyElement.addEventListener('mousedown', function() {
                        playNote(blackNoteWithOctave);
                        this.classList.add('active');
                    });
                    
                    blackKeyElement.addEventListener('mouseup', function() {
                        this.classList.remove('active');
                    });
                    
                    blackKeyElement.addEventListener('mouseleave', function() {
                        this.classList.remove('active');
                    });
                }
            });
        }
    }
    
    // 播放音符
    function playNote(note) {
        synth.triggerAttackRelease(note, '8n');
    }
    
    // 鍵盤控制
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        
        if (keyMapping[key] && !event.repeat) {
            const note = keyMapping[key];
            const octaveAddition = note.endsWith('5') ? 1 : 0;
            const cleanNote = note.replace('5', '');
            const fullNote = `${cleanNote}${currentOctave + octaveAddition}`;
            
            playNote(fullNote);
            
            // 高亮對應琴鍵
            const keyElement = document.querySelector(`.key[data-note="${fullNote}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
            }
        }
    });
    
    document.addEventListener('keyup', function(event) {
        const key = event.key.toLowerCase();
        
        if (keyMapping[key]) {
            const note = keyMapping[key];
            const octaveAddition = note.endsWith('5') ? 1 : 0;
            const cleanNote = note.replace('5', '');
            const fullNote = `${cleanNote}${currentOctave + octaveAddition}`;
            
            // 移除高亮
            const keyElement = document.querySelector(`.key[data-note="${fullNote}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
            }
        }
    });
    
    // 初始化鋼琴
    renderPiano();
    updateOctaveDisplay();
    
    // 設置初始音量
    synth.volume.value = Tone.gainToDb(parseFloat(volumeControl.value));
});
