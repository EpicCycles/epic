import logging
from operator import eq

from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from epic.forms import FrameForm, FrameChangePartForm
from epic.helpers.validation_helper import decimalForString
from epic.model_helpers.brand_helper import find_brand_for_string, find_brand_for_name
from epic.model_helpers.part_helper import find_or_create_part
from epic.models import Brand, PartType, FramePart, Frame, QuotePart, FrameExclusion, PartSection
from epic.view_helpers.menu_view_helper import add_standard_session_data, show_menu


def show_bike_review(request):
    data = base_data_for_review_bike(request)
    data['frame_brand'] = ''
    data['frame_name_selected'] = ''
    data['model_selected'] = ''

    return render(request, "epic/frame_review.html", add_standard_session_data(request, data))


def show_first_bike(request):
    data = base_data_for_review_bike(request)
    bike_review_selections = get_selections_from_screen(request)
    if bike_review_selections['frame_brand']:
        data.update(bike_review_selections)
        data.update(build_frame_list_for_review(request, bike_review_selections))
        data.update(review_details_for_frame(data['frame_ids'][0]))
        return render(request, "epic/frame_review.html", add_standard_session_data(request, data))
    else:
        messages.info(request, 'No selections made. ')
        return show_bike_review(request)


def process_bike_review(request, refresh_list):
    data = base_data_for_review_bike(request)
    data.update(get_selections_from_screen(request))

    try:
        frame_id_str = request.POST['frame_id']
        frame_id = int(frame_id_str)
    except KeyError:
        messages.info(request, 'No selections made. ')
        return show_first_bike(request)

    frame = Frame.objects.get(id=frame_id)
    if frame:
        has_errors = False
        frame_form = FrameForm(request.POST, instance=frame)
        if frame_form.is_valid():
            frame_form.save()
        else:
            has_errors = True

        redisplay_frame_parts = process_frame_parts(request, frame, has_errors)
        if redisplay_frame_parts:
            data['frame'] = frame
            data['frame_form'] = frame_form
            data['frame_sections'] = redisplay_frame_parts
            data['frame_parts'] = FramePart.objects.filter(frame=frame)
            return render(request, "epic/frame_review.html", add_standard_session_data(request, data))

    else:
        messages.error(request, 'Frame does not exist to update. ')

    # get frame form from session validate and save
    # get details from session validate and save

    # IF NO ERRORS
    if refresh_list:
        return show_first_bike(request)
    else:
        frame_id_array = request.session.get('bike_reviews', [])
        if frame_id_array[0] == frame_id:
            frame_id_array.remove(frame_id)
            request.session['bike_reviews'] = frame_id_array

        data['frame_ids'] = frame_id_array

    # if there are still frames to review
    if len(data['frame_ids']) > 0:
        data.update(review_details_for_frame(data['frame_ids'][0]))
        return render(request, "epic/frame_review.html", add_standard_session_data(request, data))
    else:
        messages.info(request, 'No frames left to review. ')
        return show_menu(request)


def process_frame_parts(request, frame, has_errors):
    part_sections = PartSection.objects.all()
    part_contents = []
    for part_section in part_sections:
        part_types = PartType.objects.filter(includeInSection=part_section)
        section_forms = []
        for part_type in part_types:
            initial_frame_part = {'part_type': part_type}
            frame_part = FramePart.objects.filter(frame=frame, part__partType=part_type).first()
            frame_part_exclusion = FrameExclusion.objects.filter(frame=frame, partType=part_type).exists()

            if frame_part_exclusion:
                initial_frame_part['not_relevant'] = True

            if frame_part:
                initial_frame_part['brand'] = frame_part.part.brand
                initial_frame_part['part_name'] = frame_part.part.part_name

            frame_change_part_form = FrameChangePartForm(request.POST, request.FILES, initial=initial_frame_part,
                                                         prefix="PT" + str(part_type.id))
            if frame_change_part_form.is_valid():
                not_relevant = frame_change_part_form.cleaned_data['not_relevant']
                if not_relevant:
                    if frame_part:
                        FramePart.objects.filter(frame=frame, part__partType=part_type).delete()
                    if not frame_part_exclusion:
                        frame_part_exclusion = FrameExclusion.objects.create_frame_exclusion(frame, part_type)
                        frame_part_exclusion.save()
                else:
                    brand = frame_change_part_form.cleaned_data['brand']
                    if brand:
                        part_name = frame_change_part_form.cleaned_data['part_name']
                        part = find_or_create_part(brand, part_type, part_name)
                        if frame_part:
                            frame_part.part = part
                            frame_part.save()
                        else:
                            frame_part = FramePart.objects.create_frame_part(frame, part)
                            frame_part.save()
                    else:
                        if frame_part:
                            frame_part.delete()

                    if frame_part_exclusion:
                        FrameExclusion.objects.filter(frame=frame, partType=part_type).delete()
            else:
                has_errors = True
            section_forms.append(frame_change_part_form)
        part_contents.append(zip(part_types, section_forms))

    if has_errors:
        return zip(part_sections, part_contents)
    else:
        return None


def base_data_for_review_bike(request):
    data = {}
    frame_list = request.session.get('frame_list', Frame.objects.all())

    frames_for_js = []
    for frame in frame_list:
        frames_for_js.append('{' + frame.getJavascriptObject() + '}')

    data['frames_for_js'] = frames_for_js
    return data


def get_selections_from_screen(request):
    selections = {'frame_brand': request.POST.get('frame_brand'),
                  'frame_name_selected': request.POST.get('frame_name_selected'),
                  'model_selected': request.POST.get('model_selected')}
    return selections


def build_frame_list_for_review(request, bike_review_selections):
    if bike_review_selections['model_selected'] == "ALL":
        full_frame_list = Frame.objects.filter(brand=bike_review_selections['frame_brand'],
                                               frame_name=bike_review_selections['frame_name_selected'])
    else:
        full_frame_list = {Frame.objects.get(pk=int(bike_review_selections['model_selected']))}
    frame_id_array = []
    for frame in full_frame_list:
        frame_id_array.append(frame.id)

    request.session['bike_reviews'] = frame_id_array
    return {'frame_ids': frame_id_array}


def build_frame_sections(frame: Frame):
    part_sections = PartSection.objects.all()
    part_contents = []
    for part_section in part_sections:
        part_types = PartType.objects.filter(includeInSection=part_section)
        section_forms = []
        for part_type in part_types:
            initial_frame_part = {'part_type': part_type}
            frame_part = FramePart.objects.filter(frame=frame, part__partType=part_type).first()
            frame_part_exclusion = FrameExclusion.objects.filter(frame=frame, partType=part_type).exists()

            if frame_part_exclusion:
                initial_frame_part['not_relevant'] = True

            if frame_part:
                initial_frame_part['brand'] = frame_part.part.brand
                initial_frame_part['part_name'] = frame_part.part.part_name
            section_forms.append(FrameChangePartForm(initial=initial_frame_part, prefix="PT" + str(part_type.id)))

        part_contents.append(zip(part_types, section_forms))
    return zip(part_sections, part_contents)


def build_frame_parts(frame):
    part_sections = PartSection.objects.all()
    part_contents = []
    for part_section in part_sections:
        part_types = PartType.objects.filter(includeInSection=part_section)
        for part_type in part_types:
            frame_part = FramePart.objects.filter(frame=frame, part__partType=part_type).first()
            if frame_part:
                part_contents.append(frame_part)

    return part_contents


def review_details_for_frame(frame_id):
    # get details fro frame and build frame form
    frame = Frame.objects.get(id=int(frame_id))
    frame_form = FrameForm(instance=frame)
    frame_edit_elements = {'frame': frame, 'frame_form': frame_form,
                           'frame_sections': build_frame_sections(frame),
                           'frame_parts':  build_frame_parts(frame)}

    return frame_edit_elements


def create_new_model(request, frame, model):
    new_frame = frame.frame
    new_frame.pk = None
    new_frame.model = model
    new_frame.sell_price = frame.keyed_sell_price

    try:
        new_frame.save()
        # get parts from frame and copy across to new_frame
        old_frameParts = QuotePart.objects.filter(frame=frame)
        # replicate the changes from the first frame
        for frame_part in old_frameParts:
            part = frame_part.part
            if part is not None:
                framePart = FramePart.objects.create_frame_part(new_frame, part)
                framePart.save()

        old_frame_exclusions = FrameExclusion.objects.get(frame=frame)
        for frame_exclusion in old_frame_exclusions:
            exclude_part_type = frame_exclusion.partType
            if not old_frameParts.filter(partType=exclude_part_type).exists():
                frameExclusion = FrameExclusion.objects.create_frame_exclusion(new_frame, exclude_part_type)
                frameExclusion.save()

    except Exception as e:
        messages.error(request, e)
        logging.getLogger("error_logger").exception('Model could not be saved')

    return HttpResponseRedirect(reverse('add_frame'))


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
        
        # variables for looping.
        line_loop_max = len(lines)
        column_loop_max = 0

        # loop over the lines and save them in db. If error , store as string and then display
        for i in range(0, line_loop_max):
            # get rid of line breaks
            clean_line = lines[i].replace('\n', '').replace('\t', '').replace('\r', '')
            if i == 0:
                #  first line is the model names
                model_names = clean_line.split(",")
                column_loop_max = len(model_names)
                for j in range(0, column_loop_max):
                    if j == 0:
                        frames.append("not a frame")
                    else:
                        model_name = model_names[j].strip()
                        frame = Frame.objects.create_frame_sparse(bike_brand, bike_name, model_name)
                        frame.save()
                        frames.append(frame)
            else:
                # attribute line
                attributes = clean_line.split(",")
                # get the partType for the lilne
                attribute_name = attributes[0].strip()

                # if this is a colour
                if attribute_name == 'Colour':
                    for j in range(0, column_loop_max):
                        # ignore the first column - already used
                        if j > 0:
                            frame_colour = str(attributes[j]).strip()

                            if len(frame_colour) > 0:
                                frames[j].colour = frame_colour
                                frames[j].save()
                # if this is a colour
                elif attribute_name == 'Description':
                    for j in range(0, column_loop_max):
                        # ignore the first column - already used
                        if j > 0:
                            frame_description = str(attributes[j]).strip()

                            if len(frame_description) > 0:
                                frames[j].description = frame_description
                                frames[j].save()
               # if this is a price
                elif attribute_name == 'Price':
                    for j in range(0, column_loop_max):
                        # ignore the first column - already used
                        if j > 0:

                            frame_price = decimalForString(attributes[j].strip())

                            if frame_price:
                                frames[j].sell_price = frame_price
                                frames[j].save()
                            else:
                                messages.error(request, 'price not provided for  ' + str(frames[j]))


                # this is a part name - look it up - fail if not found
                elif len(attribute_name) > 0:
                    try:
                        shortName = str(attributes[0]).strip()
                        partType = PartType.objects.get(shortName=shortName)
                        for j in range(0, column_loop_max):
                            # ignore the first column - already used
                            if j > 0:
                                part_name = str(attributes[j]).strip()

                                if len(part_name) > 0:
                                    if eq(part_name.lower(), 'n/a'):
                                        frameExclusion = FrameExclusion.objects.create_frame_exclusion(frames[j],
                                                                                                       partType)
                                        frameExclusion.save()
                                    else:
                                        # look for brand for part attributes
                                        part_brand = find_brand_for_string(part_name, non_web_brands, bike_brand,
                                                                           request)

                                        # take the brand name out of the part name
                                        if (part_name.lower().startswith(part_brand.brand_name.lower())):
                                            brand_name_length = len(part_brand.brand_name)
                                            part_name = part_name[brand_name_length:]
                                        part_name = part_name.strip()

                                        # now look to see if Part exists, if not add it
                                        part = find_or_create_part(part_brand, partType, part_name)
                                        framePart = FramePart.objects.create_frame_part(frames[j], part)
                                        framePart.save()

                    except MultipleObjectsReturned:
                        messages.error(request,
                                       'PartType Not unique - use Admin function to ensure PartTypes are unique: ' +
                                       attributes[
                                           0])
                    except ObjectDoesNotExist:
                        messages.error(request, 'PartType Not found for ' + attributes[0])

        messages.add_message(request, messages.INFO, 'Bike added:' + bike_name)

    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. " + repr(e))
        messages.error(request, "Unable to upload file. " + repr(e))
        return render(request, "epic/bike_upload.html", add_standard_session_data(request, data))
    return None
