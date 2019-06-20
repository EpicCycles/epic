# Generated by Django 2.0.3 on 2018-11-24 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0050_auto_20181103_1835'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='attributeoptions',
            options={'ordering': ('placing',)},
        ),
        migrations.RemoveField(
            model_name='brand',
            name='supplier',
        ),
        migrations.AddField(
            model_name='brand',
            name='supplier',
            field=models.ManyToManyField(blank=True, to='epic.Supplier'),
        ),
    ]