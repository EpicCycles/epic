from django.http import HttpResponseRedirect
from django.urls import reverse

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .models import Brand, Frame, FramePart, Part, PartType
# import the logging library and the messages
import logging
from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist

# forms and formsets used in the views
from .forms import CustomerForm, ChangeCustomerForm, AddressFormSet, PhoneFormSet, FrameForm, PartForm, FramePartForm

@login_required
def quote_menu(request):
    # create list of brands to display for external links
    brands = Brand.objects.filter(link__startswith="http")
    return render(request, 'epic/quote_menu.html', {'brands': brands})

@login_required
# based on code in http://thepythondjango.com/upload-process-csv-file-django/
def bike_upload(request):
    # create a dummy data field (could pass data here)
    data = {}
    if "GET" == request.method:
        return render(request, "epic/bike_upload.html", data)

    # if not GET, then proceed
    try:
        brand_name = request.POST.get('brand_name', '')
        try:
            bike_brand = Brand.objects.get(brand_name=str(brand_name).strip())
        except MultipleObjectsReturned :
            messages.error(request,'Brand Not unique - use Admin function to enure Brands are unique: ' + brand_name)
            return render(request, "epic/bike_upload.html", data)
        except ObjectDoesNotExist:
            messages.error(request,'Brand Not found: ' + brand_name)
            return render(request, "epic/bike_upload.html", data)

        bike_name = request.POST.get('bike_name', '')

        csv_file = request.FILES["csv_file"]

        if not csv_file.name.endswith('.csv'):
            messages.error(request,'File is not CSV type')
            return render(request, "epic/bike_upload.html", data)

        #if file is too large, return
        if csv_file.multiple_chunks():
            messages.error(request,"Uploaded file is too big (%.2f MB)." % (csv_file.size/(1000*1000),))
            return render(request, "epic/bike_upload.html", data)

        file_data = csv_file.read().decode("utf-8")

        #split the file into lines
        lines = file_data.split("\n")

        frames = []
        # get non web brands to look for part brands
        non_web_brands = Brand.objects.all()

        #loop over the lines and save them in db. If error , store as string and then display
        for i in range(len(lines)):
            if i == 0:
                #  first line is the ModelAdmin
                model_names = lines[i].split(",")
                for j in range(len(model_names)):
                    if j == 0:
                        frames.append("not a frame")
                    else:
                        model_name = model_names[j]
                        data_dict = {}
                        data_dict["brand"] = bike_brand.pk
                        data_dict["frame_name"] = bike_name
                        data_dict["model"] = model_name
                        try:
                            form = FrameForm(data_dict)
                            if form.is_valid():
                                frame = form.save()
                                frames.append(frame)
                            else:
                                logging.getLogger("error_logger").error(form.errors.as_json())
                                return render(request, "epic/bike_upload.html", data)
                        except Exception as e:
                            logging.getLogger("error_logger").error(form.errors.as_json())
                            return render(request, "epic/bike_upload.html", data)
            else:
                # attribute line
                attributes = lines[i].split(",")
                # get the partType for the lilne
                # this is the part name - look it up - fail if not found
                try:
                    shortName = str(attributes[0]).strip()
                    partType = PartType.objects.get(shortName=shortName)
                except MultipleObjectsReturned :
                    messages.error(request,'PartType Not unique - use Admin function to enure PartTypes are unique: ' + attributes[0])
                    return render(request, "epic/bike_upload.html", data)
                except ObjectDoesNotExist:
                    messages.error(request,'PartType Not found' + attributes[0])
                    return render(request, "epic/bike_upload.html", data)

                for j in range(len(attributes)):
                    #ignore the first column - already used
                    if j > 0:
                        # look for brand for part attributes
                        part_name = str(attributes[j]).strip()
                        if len(part_name) > 0:
                            part_brand = findBrandForString(part_name, non_web_brands, bike_brand, request)

                            # take the brand name out of the part name
                            part_name = part_name.strip(part_brand.brand_name)
                            part_name = part_name.strip()

                            #now look to see if Part exists, if not add it
                            part_possibles = Part.objects.filter(partType=partType,brand=part_brand,part_name=part_name)
                            if len(part_possibles) == 0:
                                # create a new one and add it
                                data_dict = {}
                                data_dict["brand"] = part_brand.pk
                                data_dict["partType"] = partType.pk
                                data_dict["part_name"] = part_name
                                try:
                                    form = PartForm(data_dict)
                                    if form.is_valid():
                                        new_part = form.save()
                                        part_possibles = Part.objects.filter(partType=partType,brand=part_brand,part_name=part_name)
                                    else:
                                        messages.error(request,'Part save failed')
                                        logging.getLogger("error_logger").error(form.errors.as_json())
                                        return render(request, "epic/bike_upload.html", data)
                                except Exception as e:
                                    logging.getLogger("error_logger").error(form.errors.as_json())
                                    return render(request, "epic/bike_upload.html", data)

                            data_dict = {}
                            data_dict["frame"] = frames[j].pk
                            data_dict["part"] = part_possibles[0].pk
                            try:
                                form = FramePartForm(data_dict)
                                if form.is_valid():
                                    form.save()
                                else:
                                    logging.getLogger("error_logger").error(form.errors.as_json())
                                    return render(request, "epic/bike_upload.html", data)
                            except Exception as e:
                                logging.getLogger("error_logger").error(form.errors.as_json())
                                return render(request, "epic/bike_upload.html", data)

        messages.add_message(request, messages.INFO, 'Bike added:' + bike_name)
    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. "+repr(e))
        messages.error(request,"Unable to upload file. "+repr(e))
        return render(request, "epic/bike_upload.html", data)
    return quote_menu(request)

def logout_view(request):
    logout(request)
    # Redirect to a success page.

def findBrandForString(search_string, brand_list, default_brand, request):
    for brand in brand_list:
        check_prefix = str(brand.brand_name).lower()
        if search_string.lower().startswith(check_prefix):
            #messages.info(request, 'found ' + check_prefix)
            return brand
    return default_brand
