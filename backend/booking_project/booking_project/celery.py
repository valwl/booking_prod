from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Установить модуль настроек Django для celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booking_project.settings')

app = Celery('booking_project')

# Загрузка настроек из Django конфигурационного файла.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Автоматическое обнаружение и загрузка tasks из всех зарегистрированных приложений Django.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
