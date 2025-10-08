#include <stdio.h>
#include "lib.h"

int main()
{
    int a = 5, b = 13;
    int risultato = somma(a, b);
    printf("La somma di %d e %d è %d\n", a, b, risultato);

    FILE *file = fopen("input.txt", "r");
    if (file == NULL)
    {
        perror("Errore nell'apertura del file");
    }
    else
    {
        char line[256];
        while (fgets(line, sizeof(line), file))
        {
            printf("%s", line);
        }
        fclose(file);
    }
    return 0;
}