# Generated by Django 5.0.3 on 2024-04-28 07:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_messages'),
    ]

    operations = [
        migrations.AddField(
            model_name='messages',
            name='is_read',
            field=models.BooleanField(default=False),
        ),
    ]
