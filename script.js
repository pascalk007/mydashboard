// Kluge Sprüche
const myQuotes = [
    "Die einzige Konstante im Leben ist die Veränderung.",
    "Das Glück ist keine Station, bei der man ankommt, sondern eine Art zu reisen.",
    "Wer nicht wagt, der nicht gewinnt.",
    "Man muss das Unmögliche versuchen, um das Mögliche zu erreichen.",
    "Die Zukunft gehört denen, die an die Wahrhaftigkeit ihrer Träume glauben.",
    "Die beste Art, die Zukunft vorauszusagen, ist, sie zu gestalten.",
    "Das Geheimnis des Erfolges ist, den Standpunkt des anderen zu verstehen.",
    "Der kürzeste Weg zu sich selbst führt um die Welt herum.",
    "Die Sprache ist die Kleidung der Gedanken.",
    "Jeder Tag ist eine neue Chance, das zu tun, was du möchtest.",
    "Wenn du etwas wirklich willst, findest du einen Weg. Wenn nicht, findest du eine Ausrede.",
    "Das größte Glück im Leben besteht darin, das zu lieben, was man tut.",
    "Die Freude an der Arbeit lässt das Werk trefflich geraten.",
    "Vorfreude ist die schönste Freude.",
    "Man muss das Leben tanzen.",
    "Das Schönste, was wir erleben können, ist das Geheimnisvolle.",
    "Das Glück ist ein Schmetterling. Jag ihm nach, und er entwischt dir. Setz dich hin, und er lässt sich auf deiner Schulter nieder.",
    "Nichts ist so beständig wie der Wandel.",
    "Lebe so, dass du die Worte bereuen würdest, die du ungesagt gelassen hast.",
    "Nichts ist so ansteckend wie das Lachen und die gute Laune."
];

// Funktion zum Aktualisieren der Uhrzeit und des Datums
function updateDateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    dateElement.textContent = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Funktion zum Anzeigen eines zufälligen Zitats
function displayRandomQuote() {
    const quoteElement = document.getElementById('quote');
    const randomIndex = Math.floor(Math.random() * myQuotes.length);
    quoteElement.textContent = myQuotes[randomIndex];
    // Zitattext im Local Storage speichern
    localStorage.setItem('quote', myQuotes[randomIndex]);
}

// Initiale Funktionen aufrufen
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    const storedQuote = localStorage.getItem('quote');
    if (storedQuote && myQuotes.includes(storedQuote)) {
        document.getElementById('quote').textContent = storedQuote;
    } else {
        fetchAndDisplayQuote();
    }
    setInterval(updateDateTime, 1000); // Aktualisiert die Uhrzeit und das Datum jede Sekunde
});

// Funktion zum Abrufen von Wetterdaten
async function fetchWeather() {
    const apiKey = '9fa2120899e979b0849bbf0e120bb358'; // Fügen Sie hier Ihren API-Schlüssel hinzu
    const city = 'Winterthur';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=de`;
    try {
        const response = await axios.get(url);
        const weatherElement = document.getElementById('weather');
        const data = response.data;
        weatherElement.innerHTML = `
            <p>${data.name}: ${data.weather[0].description}</p>
            <p>Temperatur: ${data.main.temp}°C</p>
        `;
    } catch (error) {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
        const weatherElement = document.getElementById('weather');
        weatherElement.innerHTML = '<p>Fehler beim Abrufen der Wetterdaten.</p>';
    }
}

// Rufen Sie die Funktion zum Abrufen der Wetterdaten auf, wenn das Dokument vollständig geladen ist
document.addEventListener('DOMContentLoaded', fetchWeather);

// Funktion zum Hinzufügen einer Notiz
function addNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const notesList = document.getElementById('notes-list');
        const li = document.createElement('li');
        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-note';
        deleteButton.textContent = ' löschen';
        li.textContent = noteText;
        li.appendChild(deleteButton);
        notesList.appendChild(li);
        noteInput.value = '';
        saveNotesToLocalStorage();
    }
}

// Funktion zum Entfernen einer Notiz
function removeNote(event) {
    if (event.target.classList.contains('delete-note')) {
        const listItem = event.target.parentElement;
        listItem.remove();
        saveNotesToLocalStorage();
    }
}

// Funktion zum Speichern der Notizen im Local Storage
function saveNotesToLocalStorage() {
    const notesList = document.getElementById('notes-list');
    const notes = [];
    notesList.childNodes.forEach(node => {
        if (node.tagName === 'LI') {
            notes.push(node.textContent);
        }
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Funktion zum Laden der gespeicherten Notizen aus dem Local Storage
function loadNotesFromLocalStorage() {
    const notesList = document.getElementById('notes-list');
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        const li = document.createElement('li');
        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-note';
        deleteButton.textContent = ' löschen';
        li.textContent = note;
        li.appendChild(deleteButton);
        notesList.appendChild(li);
    });
}

// Initiale Funktionen aufrufen
document.addEventListener('DOMContentLoaded', () => {
    loadNotesFromLocalStorage(); // Laden der gespeicherten Notizen beim Laden der Seite

    // Event Listener für das Hinzufügen einer Notiz
    document.getElementById('note-form').addEventListener('submit', event => {
        event.preventDefault();
        addNote();
    });

    // Event Listener für das Entfernen einer Notiz
    document.getElementById('notes-list').addEventListener('click', removeNote);
});

document.addEventListener('DOMContentLoaded', () => {
    fetchStockPrices();
});

async function fetchStockPrices() {
    const apiKey = 'MVFT2HVPS9DL69QZ'; // Dein API-Schlüssel
    const symbols = {
        smi: '^SSMI',        // Symbol für SMI
        smp500: 'SPX',       // Symbol für S&P 500
        nasdaq100: 'NDX'     // Symbol für NASDAQ 100
    };

    try {
        const smiData = await fetchStockData(symbols.smi, apiKey);
        const smp500Data = await fetchStockData(symbols.smp500, apiKey);
        const nasdaq100Data = await fetchStockData(symbols.nasdaq100, apiKey);

        console.log('SMI Data:', smiData);
        console.log('S&P 500 Data:', smp500Data);
        console.log('NASDAQ 100 Data:', nasdaq100Data);

        document.getElementById('smi').innerText = `SMI: ${smiData}`;
        document.getElementById('smp500').innerText = `S&P 500: ${smp500Data}`;
        document.getElementById('nasdaq100').innerText = `NASDAQ 100: ${nasdaq100Data}`;
    } catch (error) {
        console.error('Fehler beim Abrufen der Aktienkurse:', error);
    }
}

async function fetchStockData(symbol, apiKey) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data['Global Quote']['05. price'];
    } catch (error) {
        console.error(`Fehler beim Abrufen der Daten für ${symbol}:`, error);
        return 'Nicht verfügbar';
    }
}
