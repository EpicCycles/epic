# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-28 18:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0021_auto_20171022_2031'),
    ]

    operations = [
        migrations.AddField(
            model_name='parttypeattribute',
            name='default_value_for_quote',
            field=models.CharField(blank=True, max_length=40, null=True, verbose_name='Default for Bike Quotes '),
        ),
    ]