from django.contrib import admin
from . models import CustomUser, RefreshTokenModels


admin.site.register(CustomUser)
admin.site.register(RefreshTokenModels)
