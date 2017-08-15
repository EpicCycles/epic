from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .models import Brand

@login_required
def quote_menu(request):
    # create list of brands to display for external links
    brands = Brand.objects.filter(link__isnull=False)
    return render(request, 'epic/quote_menu.html', {'brands': brands})

@login_required
def quote_list(request):
    return render(request, 'epic/quote_list.html', {})

def logout_view(request):
    logout(request)
    # Redirect to a success page.
