from django.contrib.auth.models import User
from django.core.management import execute_from_command_line
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maharati.settings')
django.setup()

# إنشاء مستخدم مشرف جديد إذا لم يكن موجوداً
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
