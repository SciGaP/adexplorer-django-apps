from django.apps import AppConfig


class PubadConfig(AppConfig):
    name = 'pubad'
    label = name
    verbose_name = "PubAD"

    # The following are Airavata Django Portal specific custom Django app settings

    # Set url_home to a namespaced URL that will be the homepage when the custom
    # app is selected from the main menu
    # url_home = "pubad:pubad_index"

    # Set fa_icon_class to a FontAwesome CSS class for an icon to associate with
    # the custom app. Find an icon class at https://fontawesome.com/icons?d=gallery&p=2&s=regular,solid&m=free
    fa_icon_class = "fa-circle"

    # Second level navigation. Defines sub-navigation that displays on the left
    # hand side navigation bar in the Django Portal. This is optional but
    # recommended if your custom Django app has multiple entry points. See the
    # description of *nav* in
    # https://apache-airavata-django-portal.readthedocs.io/en/latest/dev/new_django_app/#appconfig-settings
    # for more details for more details.
