# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-09-17 09:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0015_auto_20170915_1830'),
    ]

    operations = [
        migrations.AddField(
            model_name='customernote',
            name='customer_visible',
            field=models.BooleanField(default=False),
        ),
    ]
