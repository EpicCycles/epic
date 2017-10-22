


# create a new fitting object from form details
from epic.models import Fitting


def create_fitting(customer, form):
    if form.cleaned_data['fitting_type'] is not None:
        fitting_type = form.cleaned_data['fitting_type']
        saddle_height = form.cleaned_data['saddle_height']
        bar_height = form.cleaned_data['bar_height']
        reach = form.cleaned_data['reach']
        notes = form.cleaned_data['notes']
        fitting = Fitting(customer=customer, fitting_type=fitting_type, saddle_height=saddle_height,
                          bar_height=bar_height, reach=reach, notes=notes)
        fitting.save()
        return fitting
    else:
        return None
