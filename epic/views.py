from django.shortcuts import render

def quote_menu(request):
    return render(request, 'epic/quote_menu.html', {})
def quote_list(request):
    return render(request, 'epic/quote_list.html', {})
