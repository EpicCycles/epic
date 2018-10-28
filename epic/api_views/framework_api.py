from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.framework_serializer import FrameworkSerializer, SectionSerializer, PartTypeSerializer, \
    PartTypeAttributeSerializer
from epic.models import PartSection, PartType, PartTypeAttribute, AttributeOptions


def validateAndPersistOption(option, part_type_attribute):
    processed_option = None
    option_id = option.get('id', None)
    option['part_type_attribute'] = part_type_attribute
    if option.get('delete', False) is True:
        if option_id is not None:
            AttributeOptions.objects.get(id=option_id).delete()

    elif option_id is None:
        serializer = PartTypeAttributeSerializer(data=option)
        if serializer.is_valid():
            serializer.save()
            processed_option = serializer.data
        else:
            option['error'] = True
            option['error_detail'] = serializer.errors
            processed_option = option
    else:
        existing_attribute = AttributeOptions.objects.get(id=option_id)
        if existing_attribute is not None:
            serializer = PartTypeAttributeSerializer(instance=existing_attribute, data=option)
            if serializer.is_valid():
                serializer.save()
                processed_option = serializer.data
            else:
                option['error'] = True
                option['error_detail'] = serializer.errors
                processed_option = option
        else:
            option['id'] = ''
            option['error'] = True
            processed_option = option

    return processed_option


def validateAndPersistAttribute(attribute, part_type_id):
    processed_attribute = None
    attribute_id = attribute.get('id', None)
    attribute['partType'] = part_type_id

    if attribute.get('delete', False) is True:
        if attribute_id is not None:
            PartTypeAttribute.objects.get(id=attribute_id).delete()

    elif attribute_id is None:
        serializer = PartTypeAttributeSerializer(data=attribute)
        if serializer.is_valid():
            serializer.save()
            processed_attribute = serializer.data
        else:
            attribute['error'] = True
            attribute['error_detail'] = serializer.errors
            processed_attribute = attribute
    else:
        existing_attribute = PartTypeAttribute.objects.get(id=attribute_id)
        if existing_attribute is not None:
            serializer = PartTypeAttributeSerializer(instance=existing_attribute, data=attribute)
            if serializer.is_valid():
                serializer.save()
                processed_attribute = serializer.data
            else:
                attribute['error'] = True
                attribute['error_detail'] = serializer.errors
                processed_attribute = attribute
        else:
            attribute['id'] = ''
            attribute['error'] = True
            processed_attribute = attribute

    if processed_attribute:
        options = attribute.get('options', [])
        part_type_attributeId = processed_attribute.get('id', None)
        if part_type_attributeId:
            processed_options = []
            for option in options:
                updated_option = validateAndPersistOption(option, part_type_attributeId)
                if updated_option is not None:
                    processed_options.append(updated_option)
                    if updated_option.get('error', False) is True:
                        processed_attribute['error'] = True
        else:
            processed_options = options

        processed_attribute['options'] = processed_options

    return processed_attribute


def validateAndPersistPartType(part_type, include_in_section):
    processed_part_type = None
    part_type_id = part_type.get('id', None)
    part_type['includeInSection'] = include_in_section
    if part_type.get('delete', False) is True:
        if part_type_id is not None:
            PartType.objects.get(id=part_type_id).delete()

    elif part_type_id is None:
        serializer = PartTypeSerializer(data=part_type)
        if serializer.is_valid():
            serializer.save()
            processed_part_type = serializer.data
        else:
            part_type['error'] = True
            part_type['error_detail'] = serializer.errors
            processed_part_type = part_type
    else:
        existing_part_type = PartType.objects.get(id=part_type_id)
        if existing_part_type is not None:
            serializer = PartTypeSerializer(instance=existing_part_type, data=part_type)
            if serializer.is_valid():
                serializer.save()
                processed_part_type = serializer.data
            else:
                part_type['error'] = True
                part_type['error_detail'] = serializer.errors
                processed_part_type = part_type
        else:
            part_type['id'] = ''
            part_type['error'] = True
            processed_part_type = part_type

    if processed_part_type:
        attributes = part_type.get('attributes', [])
        partTypeId = processed_part_type.get('id', None)
        if partTypeId:
            processed_attributes = []
            for attribute in attributes:
                updated_attribute = validateAndPersistAttribute(attribute, partTypeId)
                if updated_attribute is not None:
                    processed_attributes.append(updated_attribute)
                    if updated_attribute.get('error', False) is True:
                        processed_part_type['error'] = True
        else:
            processed_attributes = attributes

        processed_part_type['attributes'] = processed_attributes

    return processed_part_type


def validateAndPersist(part_section):
    processed_part_section = None
    part_section_id = part_section.get('id', None)
    if part_section.get('delete', False) is True:
        if part_section_id is not None:
            PartSection.objects.get(id=part_section_id).delete()

    elif part_section_id is None:
        serializer = SectionSerializer(data=part_section)
        if serializer.is_valid():
            serializer.save()
            processed_part_section = serializer.data
        else:
            part_section['error'] = True
            part_section['error_detail'] = serializer.errors
            processed_part_section = part_section
    else:
        existing_part_section = PartSection.objects.get(id=part_section_id)
        if existing_part_section is not None:
            serializer = SectionSerializer(instance=existing_part_section, data=part_section)
            if serializer.is_valid():
                serializer.save()
                processed_part_section = serializer.data
            else:
                part_section['error'] = True
                part_section['error_detail'] = serializer.errors
                processed_part_section = part_section
        else:
            part_section['id'] = ''
            part_section['error'] = True
            processed_part_section = part_section
    if processed_part_section:
        part_types = part_section.get('partTypes', [])
        include_in_section = processed_part_section.get('id', None)
        processed_part_types = []

        if include_in_section:
            for part_type in part_types:
                updated_part_type = validateAndPersistPartType(part_type, include_in_section)
                if updated_part_type is not None:
                    processed_part_types.append(updated_part_type)
                    if updated_part_type.get('error', False) is True:
                        part_section['error'] = True
        else:
            processed_part_types = part_types
        processed_part_section['partTypes'] = processed_part_types

    return processed_part_section


class Framework(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameworkSerializer

    def get_queryset(self):
        return PartSection.objects.all()

    def get(self, request, pk=None, format=None):
        serializer = FrameworkSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def post(self, request, pk=None, format=None):

        post_data = request.data
        return_data = []
        errors = False
        for part_section in post_data:
            updated_part_section = validateAndPersist(part_section)
            if updated_part_section is not None:
                return_data.append(updated_part_section)
                if updated_part_section.get('error', False) is True:
                    errors = True

        if errors:
            return Response(return_data, status=status.HTTP_202_ACCEPTED)

        serializer = FrameworkSerializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
