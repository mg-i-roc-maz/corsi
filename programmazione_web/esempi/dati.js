var intervalId = null;

function loadData() {

    //carico i dati dal file dati.json
    fetch('dati.json')
        .then(response => response.json())
        .then(data => {
            console.log('Dati caricati:', data);
            document.getElementById('output').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Errore nel caricamento dei dati:', error);
        });

    //stampo un alert qualsiasi
    console.log('Funzione loadData eseguita');

    intervalId = setInterval(() => {
        console.log('setInterval');
    }, 2000);

}