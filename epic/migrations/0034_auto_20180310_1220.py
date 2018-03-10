# Generated by Django 2.0.2 on 2018-03-10 12:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0033_auto_20180225_1029'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customernote',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='frame',
            name='colour',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='frame',
            name='description',
            field=models.TextField(blank=True, max_length=400),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='supplier',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='epic.Supplier'),
        ),
        migrations.AlterField(
            model_name='orderpayment',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='quote',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]
