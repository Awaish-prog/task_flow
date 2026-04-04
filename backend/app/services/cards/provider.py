from app.services.cards.cards import CardService
from app.services.cards.card_orders import CardOrderService

def get_cards_service() -> CardService:
    return CardService()

def get_card_orders_service() -> CardOrderService:
    return CardOrderService()