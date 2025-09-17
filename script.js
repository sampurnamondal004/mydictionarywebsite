const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = form.elements[0].value.trim();
    if (word) {
        resultDiv.innerHTML = "";
        getWordInfo(word);
        getThesaurusInfo(word);
    }
});

const getWordInfo = async (word) => {
    try {
        resultDiv.innerHTML = "<p>Fetching definition...</p>";
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (!Array.isArray(data) || data.title === "No Definitions Found") {
            resultDiv.innerHTML += `<p>No definition found for "${word}".</p>`;
            return;
        }

        const definition = data[0].meanings[0].definitions[0];

        resultDiv.innerHTML += `
            <h2>📖 Word: ${data[0].word}</h2>
            <p><strong>Part of Speech:</strong> ${data[0].meanings[0].partOfSpeech}</p>
            <p><strong>Meaning:</strong> ${definition.definition || "Not Found"}</p>
            <p><strong>Example:</strong> ${definition.example || "Not Found"}</p>
            <hr/>
        `;
    } catch (error) {
        resultDiv.innerHTML += `<p>Error fetching dictionary data.</p>`;
        console.error(error);
    }
};

const getThesaurusInfo = async (word) => {
    const apiKey = "e29a9baf-722b-440d-a6f4-7d9f64c8f0e0"; 
    const url = `https://www.dictionaryapi.com/api/v3/references/ithesaurus/json/${encodeURIComponent(word)}?key=${apiKey}`;

    try {
        resultDiv.innerHTML += `<p>Fetching synonyms and antonyms...</p>`;
        const response = await fetch(url);
        const data = await response.json();

        if (!Array.isArray(data) || typeof data[0] === "string") {
            resultDiv.innerHTML += `<p>No thesaurus data found for "${word}".</p>`;
            return;
        }

        const entry = data[0];
        const synonyms = (entry.meta?.syns?.length > 0) ? entry.meta.syns.flat() : [];
        const antonyms = (entry.meta?.ants?.length > 0) ? entry.meta.ants.flat() : [];

        let html = `<h2>🧠 Thesaurus for "${entry.meta.id}"</h2>`;

        html += `<p><strong>Synonyms:</strong></p>`;
        html += synonyms.length > 0
            ? `<ul>${synonyms.map(s => `<li>${s}</li>`).join('')}</ul>`
            : `<p>None found</p>`;

        html += `<p><strong>Antonyms:</strong></p>`;
        html += antonyms.length > 0
            ? `<ul>${antonyms.map(a => `<li>${a}</li>`).join('')}</ul>`
            : `<p>None found</p>`;

        html += `<p><a href="https://www.merriam-webster.com/thesaurus/${word}" target="_blank">🔗 Read more on Merriam-Webster</a></p>`;

        resultDiv.innerHTML += html;

    } catch (error) {
        resultDiv.innerHTML += `<p>Error fetching thesaurus data.</p>`;
        console.error(error);
    }
};
