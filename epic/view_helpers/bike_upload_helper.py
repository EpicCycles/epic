import logging

from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.shortcuts import render

from epic.model_helpers.brand_helper import find_brand_for_string, find_brand_for_name
from epic.model_helpers.part_helper import find_or_create_part
from epic.models import Brand, PartType, FramePart, Frame



def process_upload(request):
    data = {}
    try:

        brand_name = request.POST.get('brand_name', '')
        bike_brand = find_brand_for_name(brand_name, request)
        if bike_brand is None:
            return render(request, "epic/bike_upload.html", data)

        bike_name = request.POST.get('bike_name', '')
        csv_file = request.FILES["csv_file"]
        if not csv_file.name.endswith('.csv'):
            messages.error(request, 'File is not CSV type')
            return render(request, "epic/bike_upload.html", data)

        # if file is too large, return
        if csv_file.multiple_chunks():
            messages.error(request, "Uploaded file is too big (%.2f MB)." % (csv_file.size / (1000 * 1000),))
            return render(request, "epic/bike_upload.html", data)

        file_data = csv_file.read().decode("utf-8")

        # split the file into lines
        lines = file_data.split("\n")

        frames = []
        # get non web brands to look for part brands
        non_web_brands = Brand.objects.all()

        # loop over the lines and save them in db. If error , store as string and then display
        print("number of lines is "+ str(len(lines)))
        for i in range(len(lines)):
            if i == 0:
                #  first line is the model names
                model_names = lines[i].split(",")
                for j in range(len(model_names)):
                    print("column " + str(j) + " cel value " + model_names[j])
                    if j == 0:
                        frames.append("not a frame")
                    else:
                        frame = Frame.objects.create_frame_sparse(bike_brand,bike_name,model_names[j])
                        frame.save()
                        frames.append(frame)
            else:
                # attribute line
                attributes = lines[i].split(",")
                # get the partType for the lilne
                # this is the part name - look it up - fail if not found
                if len(attributes[0].strip()) > 0:
                    try:
                        shortName = str(attributes[0]).strip()
                        partType = PartType.objects.get(shortName=shortName)
                    except MultipleObjectsReturned:
                        messages.error(request,
                                       'PartType Not unique - use Admin function to enure PartTypes are unique: ' + attributes[
                                           0])
                        return render(request, "epic/bike_upload.html", data)
                    except ObjectDoesNotExist:
                        messages.error(request, 'PartType Not found for ' + attributes[0])
                        return render(request, "epic/bike_upload.html", data)

                    for j in range(len(attributes)):
                        # ignore the first column - already used
                        if j > 0:
                            # look for brand for part attributes
                            part_name = str(attributes[j])
                            if len(part_name) > 0:
                                part_brand = find_brand_for_string(part_name, non_web_brands, bike_brand, request)

                                # take the brand name out of the part name
                                if (part_name.lower().startswith(part_brand.brand_name.lower())):
                                    brand_name_length = len(part_brand.brand_name)
                                    part_name = part_name[brand_name_length:]
                                part_name = part_name.strip()


                                # now look to see if Part exists, if not add it
                                part = find_or_create_part(part_brand,partType,part_name)
                                framePart = FramePart.objects.create_framePart(frames[j],part)
                                framePart.save()

        messages.add_message(request, messages.INFO, 'Bike added:' + bike_name)

    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. " + repr(e))
        messages.error(request, "Unable to upload file. " + repr(e))
        return render(request, "epic/bike_upload.html", data)
    return None

