# Generated by Django 2.0.3 on 2019-01-18 17:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0059_auto_20190117_1856'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quote',
            name='quote_type',
        ),
    ]