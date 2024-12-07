import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "maharati.settings")

import django
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Create superuser if it doesn't exist
if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser("admin", "admin@example.com", "admin123")