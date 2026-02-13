// main.ts
// File TypeScript principale per il sito

// Seleziona il form e la lista degli oggetti
const form = document.getElementById('add-form') as HTMLFormElement | null;
const input = document.getElementById('item-input') as HTMLInputElement | null;
const list = document.getElementById('item-list') as HTMLUListElement | null;

if (form && input && list) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value.trim();
        if (value) {
            const li = document.createElement('li');
            li.textContent = value;
            list.appendChild(li);
            input.value = '';
        }
    });
}