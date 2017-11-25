# add a note to with details as specified
import logging

from django.shortcuts import render

from epic.forms import BrandForm


def save_brand(request):
    brand_form = BrandForm(request.POST)
    if brand_form.is_valid():
        try:
            brand_form.save()
            return render(request, 'epic/brand_add_popup.html', {'brand_form': BrandForm()})

        except Exception as e:
            logging.getLogger("error_logger").exception('Brand could not be saved')
            return render(request, 'epic/brand_add_popup.html', {'brand_form':brand_form})

    else:
        logging.getLogger("error_logger").error(brand_form.errors.as_json())
        return render(request, 'epic/brand_add_popup.html', {'brand_form':brand_form})

def show_brand_popup(request):
    return render(request, 'epic/brand_add_popup.html', {'brand_form': BrandForm()})