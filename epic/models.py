from __future__ import unicode_literals

# added to allow user details on models and history tables
from decimal import Decimal

from django.conf import settings
from django.db import models, IntegrityError
from django.db.models import CharField, TextField
from django.urls import reverse
from django.utils import timezone

from epic.helpers.validation_helper import is_valid_email, is_valid_post_code, is_valid_url, is_valid_telephone
from epic.model_helpers.lookup_helpers import UpperCase


CharField.register_lookup(UpperCase)
TextField.register_lookup(UpperCase)







