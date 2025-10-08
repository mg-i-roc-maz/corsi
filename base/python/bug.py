def carica_domande(file_path):
    domande = []
    with open(file_path, "r", encoding="utf-8") as f:
        for linea in f:
            parti = linea.strip().split("|")
            if len(parti) == 6:
                domanda, *opzioni, corretta = parti
                domande.append((domanda, opzioni, corretta))
    return domande


def valuta_livello(punteggio, totale):
    percentuale = (punteggio / totale) * 100
    if percentuale == 100:
        return "🌟 Guru dell'informatica!"
    elif percentuale >= 75:
        return "💻 Esperto"
    elif percentuale >= 50:
        return "📘 Intermedio"
    else:
        return "🐣 Principiante"


def quiz(domande):
    punteggio = 0
    for i, (domanda, opzioni, corretta) in enumerate(domande, 1):
        print(f"\nDomanda {i}: {domanda}")
        for idx, opzione in enumerate(opzioni, 1):
            print(f"{idx}. {opzione}")

        risposta = input("Scegli l'opzione (1-4): ")

        if risposta.isdigit() and 1 <= int(risposta) <= 4:
            scelta = opzioni[int(risposta) - 1]
            if scelta == corretta:
                print("✅ Corretto!")
                punteggio += 1
            else:
                print(f"❌ Sbagliato! La risposta giusta era: {corretta}")
        else:
            print("⚠️ Inserisci un numero valido (1-4).")

    livello = valuta_livello(punteggio, len(domande))
    print(f"\nHai totalizzato {punteggio}/{len(domande)} punti.")
    print(f"Il tuo livello: {livello}")


if __name__ == "__main__":
    domande = carica_domande("bug_quiz.txt")
    quiz(domande)