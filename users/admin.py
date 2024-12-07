from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name = 'الملف الشخصي'
    verbose_name_plural = 'الملف الشخصي'
    fieldsets = (
        ('المعلومات الشخصية', {
            'fields': ('image', 'bio', 'phone')
        }),
    )

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('-date_joined',)
    list_per_page = 20

    fieldsets = (
        ('معلومات الحساب', {
            'fields': ('username', 'password')
        }),
        ('المعلومات الشخصية', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('الصلاحيات', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('تواريخ مهمة', {
            'fields': ('last_login', 'date_joined'),
        }),
    )

    add_fieldsets = (
        ('معلومات الحساب الجديد', {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )

# إعادة تسجيل نموذج المستخدم
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')
    search_fields = ('user__username', 'phone', 'bio')
    list_filter = ('user__date_joined',)
    list_per_page = 20
    
    fieldsets = (
        ('معلومات المستخدم', {
            'fields': ('user', 'image')
        }),
        ('معلومات إضافية', {
            'fields': ('bio', 'phone')
        }),
    )
    
    verbose_name = 'ملف شخصي'
    verbose_name_plural = 'الملفات الشخصية'
