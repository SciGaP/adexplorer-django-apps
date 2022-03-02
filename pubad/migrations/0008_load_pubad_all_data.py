# Generated by Django 3.2.12 on 2022-03-02 12:46

from django.core.management import call_command
from django.db import migrations


def load_pubad_all_data(apps, schema_editor):
    call_command("loaddata", "pubad/PubAD_all_data.json")


class Migration(migrations.Migration):

    dependencies = [
        ("pubad", "0007_load_geneinfo"),
    ]

    operations = [migrations.RunPython(load_pubad_all_data, migrations.RunPython.noop)]