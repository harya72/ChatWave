# Generated by Django 5.0.3 on 2024-05-05 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_messages_is_read'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='about',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]