const form=document.querySelector('form');
const resultDiv=document.querySelector('.result');
form.addEventListener('submit',(e) => {
        e.preventDefault();
        getwordInfo(form.elements[0].value);
    });

const getwordInfo=async(word)=>{
    try{
        resultDiv.innerHTML="FETCHING_DATA......";
    const response=  await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data= await response.json();
    let definations=data[0].meanings[0].definations[0];
    resultDiv.innerHTML=
    `<h2><strong>Word:${data[0].word}</h2>
    <p class="partOfSpeech">${data[0].meanings[0].partOfSpeech}</p>
    <p><strong>Meaning:</strong>${definations.defination === undefined ? "Not Found" : definations.defination}</p>
    <p><strong>Example:</strong>${definations.example === undefined ? "Not Found" : definations.example}</p>
    <p><strong>Meaning:${definations.defination}</p>
    <p><strong>Example:${definations.example}</p>
    <p><strong>Antonyms:</strong></p>
    `;
    if(definations.antonyms.length===0){
        resultDiv.innerHTML+=`<span>NOT_FOUND</span>`;
    }
    else{for(let i=0; i<definations.antonyms.length; i++){
        resultDiv.innerHTML+= `<li>${definations.antonyms[i]}</li>`;
    }}
    if(definations.synonyms.length===0){
        resultDiv.innerHTML+=`<span>NOT_FOUND</span>`;
    }
    else{for(let i=0; i<definations.synonyms.length; i++){
        resultDiv.innerHTML+= `<li>${definations.synonyms[i]}</li>`;
    }}
    //READ_MORE_BUTTON//
    resultDiv.innerHTML+= `<div><a href="${data[0].sourceUrls}" target="_blank">READ_MORE</a></div>`;
}
   //alert("word:"+word);
   catch(error){
    resultDiv.innerHTML=`<p>SORRY_NO_WORD_FOUND</p>`
   }
   console.log(data);
}
