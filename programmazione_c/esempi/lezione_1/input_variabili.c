#include <stdio.h>

int main()
{
    char nome[50];
    int eta;

    printf("Come ti chiami? ");
    scanf("%s", nome);
    printf("Quanti anni hai? ");
    scanf("%d", &eta);
    printf("Ciao, %s! Hai %d anni.\n", nome, eta);

    return 0;
}
