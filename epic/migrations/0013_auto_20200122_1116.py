# Generated by Django 2.2.8 on 2020-01-22 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0012_auto_20190909_1333'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bike',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]