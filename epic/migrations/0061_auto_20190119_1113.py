# Generated by Django 2.0.3 on 2019-01-19 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0060_remove_quote_quote_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quote',
            name='bike_price',
        ),
        migrations.AddField(
            model_name='quote',
            name='club_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='quote',
            name='quote_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='quotepart',
            name='club_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
    ]
