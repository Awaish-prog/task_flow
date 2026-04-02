from app.services.cards.cards import CardService

def get_cards_service() -> CardService:
    return CardService()