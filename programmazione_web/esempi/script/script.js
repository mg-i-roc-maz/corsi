

var oraInizio = document.getElementById("modal-reg-att-did-input-ora-inizio").value;
var oraFine = document.getElementById("modal-reg-att-did-input-ora-fine").value;

document.querySelectorAll('input[name="partecipanti"]').forEach(p => {
    const tr = p.closest('tr');
    const inizio = tr.querySelector('input.ora-inizio-ritardo');
    const fine = tr.querySelector('input.ora-fine-ritardo');
    if (p.checked) {
        if (inizio) inizio.value = document.getElementById("modal-reg-att-did-input-ora-inizio").value;
        if (fine) fine.value = document.getElementById("modal-reg-att-did-input-ora-fine").value;
    } else {
        if (inizio) inizio.value = '';
        if (fine) fine.value = '';
    }
});

// const partecipantiNonChecked =
//     document.querySelectorAll('input[name="partecipanti"]:not(:checked)');

// partecipantiNonChecked.forEach(partecipante => {
//     const tr = partecipante.closest('tr');

//     const inputOraInizioRitardo = tr.querySelector('input.ora-inizio-ritardo');
//     if (inputOraInizioRitardo) {
//         inputOraInizioRitardo.value = '';
//     }
//     const inputOraFineRitardo = tr.querySelector('input.ora-fine-ritardo');
//     if (inputOraFineRitardo) {
//         inputOraFineRitardo.value = '';
//     }
// });

// ///tutti i partecupanti flaggati
// const partecipantiChecked =
//     document.querySelectorAll('input[name="partecipanti"]:checked');

// partecipantiChecked.forEach(partecipante => {

//     const tr = partecipante.closest('tr');

//     const inputOraInizioRitardo = tr.querySelector('input.ora-inizio-ritardo');
//     if (inputOraInizioRitardo) {
//         inputOraInizioRitardo.value = oraInizio;
//     }
//     const inputOraFineRitardo = tr.querySelector('input.ora-fine-ritardo');
//     if (inputOraFineRitardo) {
//         inputOraFineRitardo.value = oraFine;
//     }
// });



