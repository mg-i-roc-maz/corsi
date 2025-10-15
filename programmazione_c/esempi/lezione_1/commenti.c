#include <stdio.h>

#define G 9.81
int main()
{
    const float g = 9.81;
    printf("Valore di gravità con #define: %f\n", G);
    printf("Valore di gravità con const: %f\n", g);
    return 0;
}