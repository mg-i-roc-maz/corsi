#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    FILE *fin = fopen("input.bmp", "rb");
    FILE *fout = fopen("output.bmp", "wb");
    if (!fin || !fout)
    {
        printf("Errore apertura file.\n");
        return 1;
    }

    unsigned char header[54];
    fread(header, 1, 54, fin); // Leggi header BMP
    fwrite(header, 1, 54, fout);

    int width = *(int *)&header[18];
    int height = *(int *)&header[22];
    int row_padded = (width * 3 + 3) & (~3);
    unsigned char *row = malloc(row_padded);

    for (int i = 0; i < height; i++)
    {
        fread(row, 1, row_padded, fin);
        for (int j = 0; j < width; j++)
        {
            // Ogni pixel BMP a 24 bit è composto da 3 byte (B, G, R), ciascuno con valori da 0 a 255.
            // Ogni canale è memorizzato come un valore intero senza segno a 8 bit, cioè un unsigned char in C.
            // Un valore a 8 bit può rappresentare 2^8 = 256 valori distinti, che vanno da 0 a 255. Quindi:
            // 0 rappresenta l'assenza totale del colore (nero)
            // 255 rappresenta la massima intensità del colore (pieno)
            // Valori intermedi tra 0 e 255 rappresentano diverse intensità del colore.

            // Esempi di manipolazione dei pixel:

            // inversione colori
            row[j * 3] = 255 - row[j * 3];         // B
            row[j * 3 + 1] = 255 - row[j * 3 + 1]; // G
            row[j * 3 + 2] = 255 - row[j * 3 + 2]; // R

            // conversione in bianco e nero
            // Imposta il pixel a bianco o nero in base alla media dei canali
            // unsigned char gray = (row[j * 3] + row[j * 3 + 1] + row[j * 3 + 2]) / 3;
            // unsigned char bw = (gray > 127) ? 255 : 0;
            // row[j * 3] = bw;
            // row[j * 3 + 1] = bw;
            // row[j * 3 + 2] = bw;

            // scala di grigi
            // unsigned char gray = (row[j * 3] + row[j * 3 + 1] + row[j * 3 + 2]) / 3;
            // row[j * 3] = gray;
            // row[j * 3 + 1] = gray;
            // row[j * 3 + 2] = gray;

            // annullo solo il canale rosso
            // row[j * 3 + 2] = 0;
            // annullo solo il canale verde
            // row[j * 3 + 1] = 0;
            // annullo solo il canale blu
            // row[j * 3] = 0;
        }
        fwrite(row, 1, row_padded, fout);
    }

    free(row);
    fclose(fin);
    fclose(fout);
    printf("Conversione completata.\n");
    return 0;
}