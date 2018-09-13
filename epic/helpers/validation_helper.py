import re
from decimal import Decimal, ROUND_HALF_DOWN, DecimalException

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator, EmailValidator

from epic.form_helpers.regular_expressions import POSTCODE_PATTERN, NAME_PATTERN, TELEPHONE_PATTERN


def decimal_for_string(value):
    work_value = value.strip().replace('£', '')
    try:
        return Decimal(work_value).quantize(Decimal('.01'), rounding=ROUND_HALF_DOWN)
    except DecimalException as d:
        return None

    return None


def is_valid_email(email):
    validate = EmailValidator()
    try:
        validate(email)
        return True
    except (ValueError, ValidationError):
        return False


def is_valid_post_code(postcode):
    if postcode is '':
        return False

    return True


def is_valid_name(input_name):
    if input_name is '':
        return False

    match = re.match(NAME_PATTERN, input_name)
    if match is None:
        return False

    return True


def is_valid_telephone(input_telephone):
    if input_telephone is '':
        return False

    match = re.match(TELEPHONE_PATTERN, input_telephone)
    if match is None:
        return False

    return True


def is_valid_url(url):
    if url is '':
        return False

    # convert _ to - to use django validator
    test_url = url.replace('_', '-')
    try:
        validate = URLValidator()
        validate(test_url)
        return True
    except (ValueError, ValidationError):
        try:
            value = "http://" + test_url
            validate(value)
            return True
        except (ValueError, ValidationError):
            return False
