# add a note to with details as specified
import logging

from django.shortcuts import render

from epic.form_helpers.choices import set_brand_list_in_cache, get_brand_list_from_cache
from epic.forms import BrandForm


def save_brand(request):
    brand_form = BrandForm(request.POST)
    if brand_form.is_valid():
        try:
            saved_brand = brand_form.save()
            set_brand_list_in_cache()

            print('brand saved, form brand list is now', get_brand_list_from_cache())

            return render(request, 'epic/brand_add_popup.html', {'brand_form': BrandForm(),'saved_brand':saved_brand})

        except Exception as e:
            logging.getLogger("error_logger").exception('Brand could not be saved')
            return render(request, 'epic/brand_add_popup.html', {'brand_form':brand_form})

    else:
        logging.getLogger("error_logger").error(brand_form.errors.as_json())
        return render(request, 'epic/brand_add_popup.html', {'brand_form':brand_form})

def show_brand_popup(request):
    return render(request, 'epic/brand_add_popup.html', {'brand_form': BrandForm()})