def get_quote_search_parameters(request):
    quote_search_parameters = {'frame_brand': request.GET.get('frame_brand'),
                               'frame_name_selected': request.GET.get('frame_name_selected'),
                               'model_selected': request.GET.get('model_selected')}
    return quote_search_parameters
