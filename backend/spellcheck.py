from spellchecker import SpellChecker

spell = SpellChecker()


def get_corrections(text):
    misspelled = spell.unknown(text.split())
    corrections = [
        {
            "word": word,
            "suggestion": spell.correction(word),
        }
        for word in misspelled
    ]

    return {
        "original": text,
        "corrections": corrections,
    }
