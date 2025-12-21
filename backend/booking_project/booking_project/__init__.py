from __future__ import absolute_import, unicode_literals

# Эта строка обеспечит автоматическую загрузку celery при запуске Django
from .celery import app as celery_app

_all_ = ('celery_app',)
