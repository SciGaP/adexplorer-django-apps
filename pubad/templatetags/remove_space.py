from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter(name='remove_space')
@stringfilter
def remove_space(value):
    """Removes all space of str, replace by _ """
    return value.replace(' ', '_')