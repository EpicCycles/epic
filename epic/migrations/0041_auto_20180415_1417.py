# Generated by Django 2.0.3 on 2018-04-15 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0040_auto_20180412_1857'),
    ]

    operations = [
        migrations.AddField(
            model_name='quote',
            name='can_be_issued',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='quote',
            name='can_be_ordered',
            field=models.BooleanField(default=True),
        ),
    ]
