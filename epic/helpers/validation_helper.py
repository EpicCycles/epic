import re
import numbers

from decimal import Decimal, ROUND_HALF_DOWN, DecimalException


def is_number(value):
    return isinstance(value, numbers.Number)

def decimalForString(value):
    value.strip().replace('£', '')
    try:
        return Decimal(value).quantize(Decimal('.01'), rounding=ROUND_HALF_DOWN)
    except DecimalException as d:
        return None

    return None


def numberForString(value, as_int=False):
    value.strip().replace('£', '')
    if len(value) > 0 and is_number(value):
        return parseNumber(value,as_int)
    return None

def parseNumber(value, as_int=False):
    try:
        number = float(re.sub('[^.\-\d]', '', value))
        if as_int:
            return int(number + 0.5)
        else:
            return Decimal(number)
    except ValueError:
        return None