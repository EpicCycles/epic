# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-21 17:42
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('epic', '0019_auto_20171021_1720'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderPayment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True, verbose_name='Payment Amount')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='customerorder',
            name='completed_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Date complete'),
        ),
        migrations.AlterField(
            model_name='customerorder',
            name='customer_required_date',
            field=models.DateField(blank=True, null=True, verbose_name='Customer Date'),
        ),
        migrations.AlterField(
            model_name='customerorder',
            name='final_date',
            field=models.DateField(blank=True, null=True, verbose_name='Handover Date'),
        ),
        migrations.AlterField(
            model_name='historicalcustomerorder',
            name='completed_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Date complete'),
        ),
        migrations.AlterField(
            model_name='historicalcustomerorder',
            name='customer_required_date',
            field=models.DateField(blank=True, null=True, verbose_name='Customer Date'),
        ),
        migrations.AlterField(
            model_name='historicalcustomerorder',
            name='final_date',
            field=models.DateField(blank=True, null=True, verbose_name='Handover Date'),
        ),
        migrations.AlterField(
            model_name='historicalorderframe',
            name='receipt_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Date received'),
        ),
        migrations.AlterField(
            model_name='historicalorderitem',
            name='receipt_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Date received'),
        ),
        migrations.AlterField(
            model_name='orderframe',
            name='receipt_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Date received'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='receipt_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Date received'),
        ),
        migrations.AlterField(
            model_name='supplierorder',
            name='date_placed',
            field=models.DateField(blank=True, null=True, verbose_name='Order Date'),
        ),
        migrations.AddField(
            model_name='orderpayment',
            name='customerOrder',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='epic.CustomerOrder'),
        ),
    ]
