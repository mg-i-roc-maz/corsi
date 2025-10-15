#include <stdio.h>
#include <stdlib.h>

#pragma pack(push, 1)
typedef struct
{
    unsigned short type;
    unsigned int size;
    unsigned short reserved1, reserved2;
    unsigned int offset;
} BMPHeader;

typedef struct
{
    unsigned int size;
    int width, height;
    unsigned short planes;
    unsigned short bitCount;
    unsigned int compression;
    unsigned int sizeImage;
    int xPelsPerMeter, yPelsPerMeter;
    unsigned int clrUsed, clrImportant;
} BMPInfoHeader;
#pragma pack(pop)

// Funzione per invertire un canale colore
unsigned char invert(unsigned char c)
{
    return 255 - c;
}

int main(void)
{
    const char *input_file = "input.bmp";
    const char *output_file = "output.bmp";

    FILE *fin = fopen(input_file, "rb");
    if (!fin)
    {
        perror("Errore apertura file input");
        return 1;
    }

    FILE *fout = fopen(output_file, "wb");
    if (!fout)
    {
        perror("Errore apertura file output");
        fclose(fin);
        return 1;
    }

    BMPHeader header;
    BMPInfoHeader info;
    fread(&header, sizeof(BMPHeader), 1, fin);
    fread(&info, sizeof(BMPInfoHeader), 1, fin);

    if (header.type != 0x4D42 || info.bitCount != 24)
    {
        printf("Solo immagini BMP 24 bit supportate.\n");
        fclose(fin);
        fclose(fout);
        return 1;
    }

    fwrite(&header, sizeof(BMPHeader), 1, fout);
    fwrite(&info, sizeof(BMPInfoHeader), 1, fout);

    int width = info.width;
    int height = info.height;
    int row_padded = (width * 3 + 3) & (~3);
    unsigned char *row = malloc(row_padded);

    fseek(fin, header.offset, SEEK_SET);
    fseek(fout, header.offset, SEEK_SET);

    for (int i = 0; i < height; i++)
    {
        fread(row, 1, row_padded, fin);
        for (int j = 0; j < width; j++)
        {
            unsigned char b = row[j * 3];
            unsigned char g = row[j * 3 + 1];
            unsigned char r = row[j * 3 + 2];
            row[j * 3] = invert(b);
            row[j * 3 + 1] = invert(g);
            row[j * 3 + 2] = invert(r);
        }
        fwrite(row, 1, row_padded, fout);
    }

    free(row);
    fclose(fin);
    fclose(fout);
    printf("Conversione completata.\n");
    return 0;
}