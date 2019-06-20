# Generated by Django 2.0.3 on 2019-04-13 20:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0066_auto_20190410_0953'),
    ]

    operations = [
        migrations.AddField(
            model_name='quotepart',
            name='supplier',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='epic.Supplier'),
        ),
        migrations.AlterField(
            model_name='quotepart',
            name='additional_data',
            field=models.CharField(blank=True, max_length=40, null=True),
        ),
    ]