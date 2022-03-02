# adexplorer-django-apps

## Getting Started

1. Follow the instructions for installing the
   [Airavata Django Portal](https://github.com/apache/airavata-django-portal)
2. With the Airavata Django Portal virtual environment activated, clone this
   repo and install it into the portal's virtual environment

   ```
   cd adexplorer-django-apps
   pip install -e .
   ```

3. Start (or restart) the Django Portal server.

## Creating DB migrations

```
django-admin makemigrations --pythonpath . --settings pubad.tests.settings pubad
```
