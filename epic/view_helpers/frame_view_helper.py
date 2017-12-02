import logging
from operator import eq

from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from epic.model_helpers.brand_helper import find_brand_for_string, find_brand_for_name
from epic.model_helpers.part_helper import find_or_create_part
from epic.models import Brand, PartType, FramePart, Frame, QuotePart, FrameExclusion


def create_new_model(request, quote, model):
    new_frame = quote.frame
    new_frame.pk = None
    new_frame.model = model
    new_frame.sell_price = quote.keyed_sell_price

    try:
        new_frame.save()
        # get parts from quote and copy across to new_quote
        old_quoteParts = QuotePart.objects.filter(quote=quote)
        # replicate the changes from the first quote
        for quote_part in old_quoteParts:
            part = quote_part.part
            if part is not None:
                framePart = FramePart.objects.create_framePart(new_frame, part)
                framePart.save()

        old_frame_exclusions = FrameExclusion.objects.get(frame=quote.frame)
        for frame_exclusion in old_frame_exclusions:
            exclude_part_type = frame_exclusion.partType
            if not old_quoteParts.filter(partType=exclude_part_type).exists():
                frameExclusion = FrameExclusion.objects.create_frameExclusion(new_frame, exclude_part_type)
                frameExclusion.save()

    except Exception as e:
        messages.error(request, e)
        logging.getLogger("error_logger").exception('Model could not be saved')

    return HttpResponseRedirect(reverse('add_quote'))



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
                            part_name = str(attributes[j])

                            if len(part_name) > 0:
                                if eq(part_name.lower(),'n/a'):
                                    frameExclusion = FrameExclusion.objects.create_frameExclusion(frames[j], partType)
                                    frameExclusion.save()
                                else:
                                    # look for brand for part attributes
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

