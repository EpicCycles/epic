# Generated by Django 2.0.3 on 2018-12-23 12:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0054_auto_20181214_1927'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quote',
            name='frame',
        ),
        migrations.AddField(
            model_name='quote',
            name='bike',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='epic.Bike'),
        ),
    ]
