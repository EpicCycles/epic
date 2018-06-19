import logging
from datetime import datetime
from operator import eq

from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from epic.form_helpers.choices import get_part_section_list_from_cache, get_part_types_for_section_from_cache
from epic.forms import FrameForm, FrameChangePartForm
from epic.helpers.validation_helper import decimal_for_string
from epic.model_helpers.brand_helper import find_brand_for_string, find_brand_for_name
from epic.model_helpers.frame_helper import get_frames_for_js, set_frames_for_js
from epic.model_helpers.part_helper import find_or_create_part
from epic.models import Brand, PartType, FramePart, Frame, QuotePart, FrameExclusion
from epic.view_helpers.menu_view_helper import add_standard_session_data


def show_bike_review(request):
    data = base_data_for_review_bike(request)
    data['frame_brand'] = ''
    data['frame_name_selected'] = ''
    data['model_selected'] = ''

    return render(request, "epic/frames/frame_review.html", add_standard_session_data(request, data))


def show_first_bike(request):
    data = base_data_for_review_bike(request)

    bike_review_selections = get_frame_selections_from_screen(request)
    if bike_review_selections['frame_brand']:
        data.update(bike_review_selections)
        data.update(build_frame_list_for_review(request, bike_review_selections))
        data.update(review_details_for_frame(data['frame_ids'][0]))
        return render(request, "epic/frames/frame_review.html", add_standard_session_data(request, data))
    else:
        messages.info(request, 'No selections made. ')
        return show_bike_review(request)


def show_next_bike(request):
    print('{timestamp} -- show next started'.format(timestamp=datetime.utcnow().isoformat()))

    data = base_data_for_review_bike(request)
    data.update(get_frame_selections_from_screen(request))

    try:
        frame_id_str = request.POST['frame_id']
        frame_id = int(frame_id_str)
    except KeyError:
        messages.info(request, 'Data has been changed since you requested the review - selection has been reset. ')
        return show_first_bike(request)

    data['frame_ids'] = update_frame_list_in_session(request, frame_id)

    # if there are still frames to review
    if len(data['frame_ids']) > 0:
        data.update(review_details_for_frame(data['frame_ids'][0]))
        print('{timestamp} -- show next with bike ended'.format(timestamp=datetime.utcnow().isoformat()))

        return render(request, "epic/frames/frame_review.html", add_standard_session_data(request, data))
    else:
        messages.info(request, 'No frames left to review. ')
        return show_bike_review(request)


def update_frame_list_in_session(request, frame_id):
    frame_id_array = request.session.get('bike_reviews', [])
    if frame_id_array[0] == frame_id:
        frame_id_array.remove(frame_id)

    return frame_id_array


def process_bike_review(request, refresh_list):
    print('{timestamp} -- save and show another started'.format(timestamp=datetime.utcnow().isoformat()))

    data = base_data_for_review_bike(request)
    data.update(get_frame_selections_from_screen(request))

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
            data['frame_sections'] = redisplay_frame_parts['frame_sections']
            data['frame_parts'] = redisplay_frame_parts['part_list']
            return render(request, "epic/frames/frame_review.html", add_standard_session_data(request, data))

    else:
        messages.error(request, 'Frame does not exist to update. ')

    # IF NO ERRORS
    if refresh_list:
        return show_first_bike(request)
    else:
        data['frame_ids'] = update_frame_list_in_session(request, frame_id)

    # if there are still frames to review
    if len(data['frame_ids']) > 0:
        data.update(review_details_for_frame(data['frame_ids'][0]))
        return render(request, "epic/frames/frame_review.html", add_standard_session_data(request, data))
    else:
        messages.info(request, 'No frames left to review. ')
        return show_bike_review(request)


def process_frame_parts(request, frame, has_errors):
    part_sections = get_part_section_list_from_cache()
    part_contents = []
    part_list = []

    all_parts_for_frame = FramePart.objects.filter(frame=frame)
    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        section_forms = []
        for part_type in part_types:
            initial_frame_part = {'part_type': part_type}
            frame_part = all_parts_for_frame.filter(part__partType=part_type) \
                .prefetch_related('part', 'part__brand').first()
            frame_part_exclusion = FrameExclusion.objects.filter(frame=frame, partType=part_type).exists()

            if frame_part_exclusion:
                initial_frame_part['not_relevant'] = True

            if frame_part:
                initial_frame_part['brand'] = frame_part.part.brand.id
                initial_frame_part['part_name'] = frame_part.part.part_name

            frame_change_part_form = FrameChangePartForm(request.POST, request.FILES, initial=initial_frame_part,
                                                         prefix="PT" + str(part_type.id))
            if frame_change_part_form.is_valid():
                not_relevant = frame_change_part_form.cleaned_data['not_relevant']
                if not_relevant:
                    if frame_part:
                        all_parts_for_frame.filter(part__partType=part_type).delete()
                    if not frame_part_exclusion:
                        frame_part_exclusion = FrameExclusion.objects.create_frame_exclusion(frame, part_type)
                        frame_part_exclusion.save()
                else:
                    brand_id = frame_change_part_form.cleaned_data['brand']
                    if brand_id:
                        brand = Brand.objects.get(id=brand_id)
                        part_name = frame_change_part_form.cleaned_data['part_name']
                        part = find_or_create_part(brand, part_type, part_name)
                        if frame_part:
                            frame_part.part = part
                            frame_part.save()
                        else:
                            frame_part = FramePart.objects.create_frame_part(frame, part)
                            frame_part.save()
                        part_list.append(str(frame_part))
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
        return {'frame_sections': zip(part_sections, part_contents), 'part_list': part_list}
    else:
        return None


def base_data_for_review_bike(request):
    data = {'frames_for_js': get_frames_for_js()}
    return data


def get_frame_selections_from_screen(request):
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


def build_frame_elements(frame: Frame):
    part_sections = get_part_section_list_from_cache()
    part_contents = []
    all_parts_for_frame = FramePart.objects.filter(frame=frame)
    part_list = []
    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        section_forms = []
        for part_type in part_types:
            initial_frame_part = {'part_type': part_type}
            frame_parts = all_parts_for_frame.filter(part__partType=part_type) \
                .prefetch_related('part', 'part__brand', 'part__partType')
            frame_part_exclusion = FrameExclusion.objects.filter(frame=frame, partType=part_type).exists()

            if frame_part_exclusion:
                initial_frame_part['not_relevant'] = True

            if frame_parts:
                part_list.append(str(frame_parts[0]))
                initial_frame_part['brand'] = frame_parts[0].part.brand.id
                initial_frame_part['part_name'] = frame_parts[0].part.part_name
            section_forms.append(FrameChangePartForm(initial=initial_frame_part, prefix="PT" + str(part_type.id)))

        part_contents.append(zip(part_types, section_forms))
    return {'frame_sections': zip(part_sections, part_contents), 'part_list': part_list}


def review_details_for_frame(frame_id):
    # get details fro frame and build frame form
    frame = Frame.objects.get(id=int(frame_id))
    frame_form = FrameForm(instance=frame)
    frame_page_elements = build_frame_elements(frame)
    frame_edit_elements = {'frame': frame, 'frame_form': frame_form,
                           'frame_sections': frame_page_elements['frame_sections'],
                           'frame_parts': frame_page_elements['part_list']}

    return frame_edit_elements


def create_new_model(request, frame, model):
    new_frame = frame.frame
    new_frame.pk = None
    new_frame.model = model
    new_frame.sell_price = frame.keyed_sell_price

    try:
        new_frame.save()
        # get parts from frame and copy across to new_frame
        old_frameParts = QuotePart.objects.filter(frame=frame).prefetch_related('part', 'part__partType')
        # replicate the changes from the first frame
        for frame_part in old_frameParts:
            part = frame_part.part
            if part is not None:
                new_frame_part = FramePart.objects.create_frame_part(new_frame, part)
                new_frame_part.save()

        old_frame_exclusions = FrameExclusion.objects.get(frame=frame)
        for frame_exclusion in old_frame_exclusions:
            exclude_part_type = frame_exclusion.partType
            if not old_frameParts.filter(part__partType=exclude_part_type).exists():
                new_frame_exclusion = FrameExclusion.objects.create_frame_exclusion(new_frame, exclude_part_type)
                new_frame_exclusion.save()

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
            return render(request, "epic/frames/bike_upload.html", data)

        bike_name = request.POST.get('bike_name', '')
        csv_file = request.FILES["csv_file"]
        if not csv_file.name.endswith('.csv'):
            messages.error(request, 'File is not CSV type')
            return render(request, "epic/frames/bike_upload.html", data)

        # if file is too large, return
        if csv_file.multiple_chunks():
            messages.error(request, "Uploaded file is too big (%.2f MB)." % (csv_file.size / (1000 * 1000),))
            return render(request, "epic/frames/bike_upload.html", data)

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

                            frame_price = decimal_for_string(attributes[j].strip())

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
        set_frames_for_js()

    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. " + repr(e))
        messages.error(request, "Unable to upload file. " + repr(e))
        return render(request, "epic/frames/bike_upload.html", add_standard_session_data(request, data))
    return None
