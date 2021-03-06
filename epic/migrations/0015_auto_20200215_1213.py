# Generated by Django 2.2.10 on 2020-02-15 12:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0014_auto_20200207_1643'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customerphone',
            name='customer',
        ),
        migrations.RemoveField(
            model_name='fitting',
            name='customer',
        ),
        migrations.RemoveField(
            model_name='quoteanswer',
            name='question',
        ),
        migrations.RemoveField(
            model_name='quoteanswer',
            name='quote',
        ),
        migrations.RemoveField(
            model_name='quotecharge',
            name='charge',
        ),
        migrations.RemoveField(
            model_name='quotecharge',
            name='quote',
        ),
        migrations.RemoveField(
            model_name='quotepart',
            name='part',
        ),
        migrations.RemoveField(
            model_name='quotepart',
            name='partType',
        ),
        migrations.RemoveField(
            model_name='quotepart',
            name='quote',
        ),
        migrations.RemoveField(
            model_name='quotepart',
            name='supplier',
        ),
        migrations.AddField(
            model_name='customer',
            name='addresses',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customer',
            name='fittings',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customer',
            name='phoneNumbers',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='part',
            name='countUses',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='quote',
            name='answers',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='quote',
            name='charges',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='quote',
            name='quoteParts',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='quote',
            name='fitting',
            field=models.PositiveSmallIntegerField(null=True),
        ),
        migrations.DeleteModel(
            name='CustomerAddress',
        ),
        migrations.DeleteModel(
            name='CustomerPhone',
        ),
        migrations.DeleteModel(
            name='Fitting',
        ),
        migrations.DeleteModel(
            name='QuoteAnswer',
        ),
        migrations.DeleteModel(
            name='QuoteCharge',
        ),
        migrations.DeleteModel(
            name='QuotePart',
        ),
    ]
