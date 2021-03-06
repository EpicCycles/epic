# Generated by Django 2.0.3 on 2019-01-17 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('epic', '0058_auto_20190112_1410'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='parttype',
            options={'ordering': ('includeInSection', 'placing', 'name')},
        ),
        migrations.RemoveIndex(
            model_name='attributeoptions',
            name='epic_attrib_part_ty_8d8194_idx',
        ),
        migrations.RemoveIndex(
            model_name='parttype',
            name='epic_partty_include_5e850d_idx',
        ),
        migrations.RenameField(
            model_name='attributeoptions',
            old_name='attribute_option',
            new_name='option_name',
        ),
        migrations.RenameField(
            model_name='customernote',
            old_name='created_on',
            new_name='created_date',
        ),
        migrations.RenameField(
            model_name='fitting',
            old_name='notes',
            new_name='note_text',
        ),
        migrations.RenameField(
            model_name='part',
            old_name='trade_in_value',
            new_name='trade_in_price',
        ),
        migrations.RenameField(
            model_name='parttype',
            old_name='customer_facing',
            new_name='customer_visible',
        ),
        migrations.RenameField(
            model_name='parttype',
            old_name='shortName',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='parttypesynonym',
            old_name='shortName',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='quote',
            old_name='frame_sell_price',
            new_name='bike_price',
        ),
        migrations.RenameField(
            model_name='quote',
            old_name='keyed_sell_price',
            new_name='epic_price',
        ),
        migrations.RenameField(
            model_name='quote',
            old_name='sell_price',
            new_name='rrp',
        ),
        migrations.RenameField(
            model_name='quotepart',
            old_name='sell_price',
            new_name='epic_price',
        ),
        migrations.RenameField(
            model_name='supplier',
            old_name='website',
            new_name='link',
        ),
        migrations.AddField(
            model_name='quotepart',
            name='rrp',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True),
        ),
        migrations.AddIndex(
            model_name='attributeoptions',
            index=models.Index(fields=['part_type_attribute', 'option_name'], name='epic_attrib_part_ty_0587db_idx'),
        ),
        migrations.AddIndex(
            model_name='parttype',
            index=models.Index(fields=['includeInSection', 'name'], name='epic_partty_include_8d9d73_idx'),
        ),
    ]
