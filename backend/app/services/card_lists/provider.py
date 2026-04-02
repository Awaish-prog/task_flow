from app.services.card_lists.card_lists import CardListService

def get_card_lists_service() -> CardListService:
    return CardListService()