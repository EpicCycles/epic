# Generated by Django 2.0.3 on 2019-04-26 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0071_quote_bike_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='club_member',
            field=models.BooleanField(default=False),
        ),
    ]
