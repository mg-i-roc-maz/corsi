#include <stdio.h>

// Definizione di una enum per i giorni della settimana
typedef enum {
    LUNEDI,
    MARTEDI,
    MERCOLEDI,
    GIOVEDI,
    VENERDI,
    SABATO,
    DOMENICA
} Giorno;

typedef enum {
    ROSSO = 'r',
    GIALLO = 'g',
    VERDE = 'v'
} Semaforo;

int main() {

    int giorno_input;
    printf("Inserisci il giorno della settimana (0=LUNEDI, 1=MARTEDI, ..., 6=DOMENICA): ");
    scanf("%d", &giorno_input);
    Giorno oggi = (Giorno)giorno_input;

    switch (oggi) {
        case LUNEDI:
            printf("Oggi è lunedì.\n");
            break;
        case MARTEDI:
            printf("Oggi è martedì.\n");
            break;
        case MERCOLEDI:
            printf("Oggi è mercoledì.\n");
            break;
        case GIOVEDI:
            printf("Oggi è giovedì.\n");
            break;
        case VENERDI:
            printf("Oggi è venerdì.\n");
            break;
        case SABATO:
            printf("Oggi è sabato.\n");
            break;
        case DOMENICA:
            printf("Oggi è domenica.\n");
            break;
        default:
            printf("Giorno non valido. Valore inserito: %d\n", oggi);
    }


    char semaforo_input;
    printf("Inserisci il colore del semaforo (r=ROSSO, g=GIALLO, v=VERDE): ");
    scanf(" %c", &semaforo_input);
    Semaforo semaforo = (Semaforo)semaforo_input;

    switch (semaforo) {
        case ROSSO:
            printf("Il semaforo è rosso.\n");
            break;
        case GIALLO:
            printf("Il semaforo è giallo.\n");
            break;
        case VERDE:
            printf("Il semaforo è verde.\n");
            break;
        default:
            printf("Colore del semaforo non valido. Valore inserito: %c\n", semaforo_input);
    }

    return 0;
}