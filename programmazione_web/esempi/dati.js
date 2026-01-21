function loadData() {
    fetch('dati.json')
        .then(response => response.json())
        .then(data => {
            console.log('Dati caricati:', data);
            document.getElementById('output').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Errore nel caricamento dei dati:', error);
        });
}