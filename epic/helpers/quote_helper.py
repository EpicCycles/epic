from epic.helpers.note_helper import create_note_for_requote, create_note_for_quote_archive
from epic.models.quote_models import INITIAL, ARCHIVED, Quote


def quote_requote(request, quote: Quote):
    """

    Args:
        request (HttpRequest)
        quote (Quote):
    """
    quote.quote_status = INITIAL
    quote.issued_date = None
    quote.save()

    create_note_for_requote(quote, request.user)


def quote_archive(request, quote):
    if quote.quote_status == ARCHIVED:
        pass
    else:
        quote.quote_status = ARCHIVED
        quote.save()

        create_note_for_quote_archive(quote, request.user)
