from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from courses.admin import CustomAdminSite

# إنشاء نسخة من موقع الإدارة المخصص
admin_site = CustomAdminSite(name='custom_admin')

# نقل جميع النماذج المسجلة من موقع الإدارة الافتراضي إلى الموقع المخصص
admin_site._registry = admin.site._registry

urlpatterns = [
    path('admin/', admin_site.urls),  # استخدام موقع الإدارة المخصص
    path('', include('courses.urls')),
    path('users/', include('users.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
