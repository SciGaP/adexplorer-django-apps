import os

BASEDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = "abc123"
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    "pubad.apps.PubadConfig",
]
