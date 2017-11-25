# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-19 15:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0025_auto_20171111_1802'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalquote',
            name='colour',
            field=models.CharField(blank=True, max_length=40, null=True, verbose_name='Colour'),
        ),
        migrations.AddField(
            model_name='historicalquote',
            name='colour_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='historicalquote',
            name='frame_size',
            field=models.CharField(blank=True, max_length=15, null=True, verbose_name='Frame Size'),
        ),
        migrations.AddField(
            model_name='quote',
            name='colour',
            field=models.CharField(blank=True, max_length=40, null=True, verbose_name='Colour'),
        ),
        migrations.AddField(
            model_name='quote',
            name='colour_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='quote',
            name='frame_size',
            field=models.CharField(blank=True, max_length=15, null=True, verbose_name='Frame Size'),
        ),
    ]
