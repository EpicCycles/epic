# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-08-17 17:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0005_auto_20170817_1740'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quote',
            name='cost_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AlterField(
            model_name='quote',
            name='frame_cost_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AlterField(
            model_name='quote',
            name='frame_sell_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AlterField(
            model_name='quote',
            name='sell_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
    ]
