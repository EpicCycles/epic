from django.db.models import Transform


class UpperCase(Transform):
    lookup_name = 'upper'
    function = 'UPPER'
    bilateral = True

