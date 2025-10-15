#include <stdio.h>

int main()
{
    int numbers[5];

    printf("Inserisci cinque numeri interi:\n");
    for (int i = 0; i < 5; i++)
    {
        printf("Numero %d: ", i + 1);
        scanf("%d", &numbers[i]);
    }

    int max = numbers[0];
    for (int i = 1; i < 5; i++)
    {
        if (numbers[i] > max)
        {
            max = numbers[i];
        }
    }
    printf("Il maggiore è: %d\n", max);

    return 0;
}