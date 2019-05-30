from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.framework_serializer import FrameworkSerializer, SectionSerializer, PartTypeSerializer, \
    PartTypeAttributeSerializer, AttributeOptionsSerializer, PartTypeSynonymSerializer
from epic.models.framework_models import PartSection, PartType, PartTypeAttribute, AttributeOptions, PartTypeSynonym


def validateAndPersistOption(option, part_type_attribute):
    processed_option = None
    option_id = option.get('id', None)
    option['part_type_attribute'] = part_type_attribute
    if option.get('delete', False) is True:
        if option_id is not None:
            AttributeOptions.objects.get(id=option_id).delete()

    elif option_id is None:
        processed_option = create_attribute_option(option)
    else:
        processed_option = update_existing_attribute_option(option, option_id)

    return processed_option


def update_existing_attribute_option(option, option_id):
    existing_option = AttributeOptions.objects.get(id=option_id)
    if existing_option is not None:
        serializer = AttributeOptionsSerializer(existing_option, data=option)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            option['error'] = True
            option['error_detail'] = serializer.errors
            return option
    else:
        option['id'] = ''
        option['error'] = True
        return option


def create_attribute_option(option):

    serializer = AttributeOptionsSerializer(data=option)
    if serializer.is_valid():
        serializer.save()
        processed_option = serializer.data
    else:
        option['error'] = True
        option['error_detail'] = serializer.errors
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
        processed_attribute = create_new_attribute(attribute)
    else:
        processed_attribute = update_existing_attribute(attribute, attribute_id)

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


def update_existing_attribute(attribute, attribute_id):
    existing_attribute = PartTypeAttribute.objects.get(id=attribute_id)
    if existing_attribute is not None:
        serializer = PartTypeAttributeSerializer(existing_attribute, data=attribute)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            attribute['error'] = True
            attribute['error_detail'] = serializer.errors
            return attribute
    else:
        attribute['id'] = ''
        attribute['error'] = True
        return attribute


def create_new_attribute(attribute):
    serializer = PartTypeAttributeSerializer(data=attribute)
    if serializer.is_valid():
        serializer.save()
        processed_attribute = serializer.data
    else:
        attribute['error'] = True
        attribute['error_detail'] = serializer.errors
        processed_attribute = attribute
    return processed_attribute


def validateAndPersistSynonym(synonym, part_type_id):
    processed_synonym = None
    synonym_id = synonym.get('id', None)
    synonym['partType'] = part_type_id

    if synonym.get('delete', False) is True:
        if synonym_id is not None:
            PartTypeSynonym.objects.get(id=synonym_id).delete()

    elif synonym_id is None:
        processed_synonym = create_new_synonym(synonym)
    else:
        processed_synonym = update_existing_synonym(synonym, synonym_id)

    return processed_synonym


def update_existing_synonym(synonym, synonym_id):
    existing_synonym = PartTypeSynonym.objects.get(id=synonym_id)
    if existing_synonym is not None:
        serializer = PartTypeSynonymSerializer(existing_synonym, data=synonym)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            synonym['error'] = True
            synonym['error_detail'] = serializer.errors
            return synonym
    else:
        synonym['id'] = ''
        synonym['error'] = True
        return synonym


def create_new_synonym(synonym):
    serializer = PartTypeSynonymSerializer(data=synonym)
    if serializer.is_valid():
        serializer.save()
        processed_synonym = serializer.data
    else:
        synonym['error'] = True
        synonym['error_detail'] = serializer.errors
        processed_synonym = synonym
    return processed_synonym


def validateAndPersistPartType(part_type, include_in_section):
    processed_part_type = None
    part_type_id = part_type.get('id', None)
    part_type['includeInSection'] = include_in_section
    if part_type.get('delete', False) is True:
        if part_type_id is not None:
            PartType.objects.get(id=part_type_id).delete()

    elif part_type_id is None:
        processed_part_type = create_new_part_type(part_type)
    else:
        processed_part_type = update_existing_part_type(part_type, part_type_id)

    if processed_part_type:
        attributes = part_type.get('attributes', [])
        synonyms = part_type.get('synonyms', [])
        processed_attributes = []
        processed_synonyms = []
        partTypeId = processed_part_type.get('id', None)
        if partTypeId:
            for attribute in attributes:
                updated_attribute = validateAndPersistAttribute(attribute, partTypeId)
                if updated_attribute is not None:
                    processed_attributes.append(updated_attribute)
                    if updated_attribute.get('error', False) is True:
                        processed_part_type['error'] = True

            for synonym in synonyms:
                updated_synonym = validateAndPersistSynonym(synonym, part_type_id)
                if updated_synonym is not None:
                    processed_synonyms.append(updated_synonym)
                    if updated_synonym.get('error', False) is True:
                        processed_part_type['error'] = True

        else:
            processed_attributes = attributes
            processed_synonyms = synonyms

        processed_part_type['attributes'] = processed_attributes
        processed_part_type['synonyms'] = processed_synonyms

    return processed_part_type


def update_existing_part_type(part_type, part_type_id):
    existing_part_type = PartType.objects.get(id=part_type_id)
    if existing_part_type is not None:
        serializer = PartTypeSerializer(existing_part_type, data=part_type)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            part_type['error'] = True
            part_type['error_detail'] = serializer.errors
            return part_type
    else:
        part_type['id'] = ''
        part_type['error'] = True
        return part_type


def create_new_part_type(part_type):
    serializer = PartTypeSerializer(data=part_type)
    if serializer.is_valid():
        serializer.save()
        processed_part_type = serializer.data
    else:
        part_type['error'] = True
        part_type['error_detail'] = serializer.errors
        processed_part_type = part_type
    return processed_part_type


def validateAndPersist(part_section):
    processed_part_section = None
    part_section_id = part_section.get('id', None)
    if part_section.get('delete', False) is True:
        if part_section_id is not None:
            PartSection.objects.get(id=part_section_id).delete()

    elif part_section_id is None:
        processed_part_section = create_part_section(part_section)
    else:
        processed_part_section = save_existing_part_section(part_section, part_section_id)

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


def save_existing_part_section(part_section, part_section_id):
    existing_part_section = PartSection.objects.get(id=part_section_id)
    if existing_part_section is not None:
        serializer = SectionSerializer(existing_part_section, data=part_section)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            part_section['error'] = True
            part_section['error_detail'] = serializer.errors
            return part_section
    else:
        part_section['id'] = ''
        part_section['error'] = True
        return part_section


def create_part_section(part_section):
    serializer = SectionSerializer(data=part_section)
    if serializer.is_valid():
        serializer.save()
        processed_part_section = serializer.data
    else:
        part_section['error'] = True
        part_section['error_detail'] = serializer.errors
        processed_part_section = part_section
    return processed_part_section


class Framework(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameworkSerializer

    def get_queryset(self):
        return PartSection.objects.all()

    def get(self, request):
        serializer = FrameworkSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def post(self, request):

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
