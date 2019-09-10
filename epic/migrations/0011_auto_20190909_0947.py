# Generated by Django 2.0.3 on 2019-09-09 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0010_question_bike_only'),
    ]

    operations = [
        migrations.AddField(
            model_name='charge',
            name='fixed_charge',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='charge',
            name='percentage',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True),
        ),
        migrations.AlterField(
            model_name='charge',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
    ]
