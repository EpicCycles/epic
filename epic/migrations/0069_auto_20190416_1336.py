# Generated by Django 2.0.3 on 2019-04-16 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0068_quote_club_member'),
    ]

    operations = [
        migrations.AddField(
            model_name='quotepart',
            name='club_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='quotepart',
            name='ticket_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
    ]
