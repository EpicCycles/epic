# Generated by Django 2.0.3 on 2019-09-09 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0011_auto_20190909_0947'),
    ]

    operations = [
        migrations.AddField(
            model_name='quote',
            name='charges_total',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='quote',
            name='fixed_price_total',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
    ]
