from django import template

register = template.Library()

@register.filter
def remove_space(value):
    return value
