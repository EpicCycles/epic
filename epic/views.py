from django.shortcuts import render
from .models import Brand

def quote_menu(request):
    # create list of brands to display for external links
    brands = Brand.objects.filter(link__isnull=False)
    return render(request, 'epic/quote_menu.html', {'brands': brands})

def quote_list(request):
    return render(request, 'epic/quote_list.html', {})
