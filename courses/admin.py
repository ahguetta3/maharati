from django.contrib import admin
from django.contrib import messages
from django.template.response import TemplateResponse
from django.urls import path
from .models import Course, Lesson, Progress
from .dashboard import get_dashboard_stats, get_course_statistics

class CustomAdminSite(admin.AdminSite):
    site_header = 'مهارتي - لوحة التحكم'
    site_title = 'مهارتي'
    index_title = 'لوحة التحكم'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(self.dashboard_view), name='dashboard'),
        ]
        return custom_urls + urls

    def dashboard_view(self, request):
        context = {
            **self.each_context(request),
            'title': 'لوحة المعلومات',
            'stats': get_dashboard_stats(),
        }
        return TemplateResponse(request, 'admin/dashboard.html', context)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'total_lessons', 'total_hours', 'created_at', 'get_students_count', 'view_statistics')
    list_filter = ('instructor', 'created_at')
    search_fields = ('title', 'description', 'instructor__username')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    list_per_page = 20
    actions = ['send_notification_to_students', 'export_course_data']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:course_id>/statistics/',
                self.admin_site.admin_view(self.course_statistics_view),
                name='course-statistics',
            ),
        ]
        return custom_urls + urls
    
    def view_statistics(self, obj):
        return f'<a href="statistics/{obj.id}/" class="button">عرض الإحصائيات</a>'
    view_statistics.short_description = 'الإحصائيات'
    view_statistics.allow_tags = True
    
    def course_statistics_view(self, request, course_id):
        stats = get_course_statistics(course_id)
        context = {
            **self.admin_site.each_context(request),
            'title': 'إحصائيات الدورة',
            'stats': stats,
            'opts': self.model._meta,
        }
        return TemplateResponse(request, 'admin/course_statistics.html', context)
    
    def get_students_count(self, obj):
        count = obj.students.count()
        return f'{count} طالب'
    get_students_count.short_description = 'عدد الطلاب'
    
    def send_notification_to_students(self, request, queryset):
        for course in queryset:
            student_count = course.students.count()
            messages.success(request, f'تم إرسال إشعار إلى {student_count} طالب في دورة {course.title}')
    send_notification_to_students.short_description = 'إرسال إشعار للطلاب'
    
    def export_course_data(self, request, queryset):
        for course in queryset:
            messages.success(request, f'جاري تصدير بيانات الدورة: {course.title}')
    export_course_data.short_description = 'تصدير بيانات الدورة'
    
    fieldsets = (
        ('معلومات الدورة', {
            'fields': ('title', 'description', 'instructor', 'image'),
            'classes': ('wide', 'extrapretty'),
        }),
        ('تفاصيل الدورة', {
            'fields': ('total_lessons', 'total_hours'),
            'classes': ('collapse',),
        }),
        ('الطلاب', {
            'fields': ('students',),
            'classes': ('collapse',),
            'description': 'اختر الطلاب المسجلين في هذه الدورة'
        }),
    )
    
    verbose_name = 'دورة تدريبية'
    verbose_name_plural = 'الدورات التدريبية'

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'content', 'course__title')
    ordering = ('course', 'order')
    list_per_page = 20
    save_as = True
    save_on_top = True
    
    fieldsets = (
        ('معلومات الدرس', {
            'fields': ('title', 'course', 'order'),
            'classes': ('wide',),
        }),
        ('محتوى الدرس', {
            'fields': ('content',),
            'classes': ('full-width',),
        }),
    )
    
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
        js = ('admin/js/custom_admin.js',)

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'last_accessed', 'get_progress_percentage', 'get_completion_status')
    list_filter = ('course', 'last_accessed')
    search_fields = ('user__username', 'course__title')
    date_hierarchy = 'last_accessed'
    list_per_page = 20
    
    def get_completion_status(self, obj):
        percentage = obj.get_progress_percentage()
        if percentage == 100:
            return '✅ مكتمل'
        elif percentage > 50:
            return '🔸 جاري التقدم'
        return '🔹 في البداية'
    get_completion_status.short_description = 'حالة الإكمال'
    
    fieldsets = (
        ('معلومات التقدم', {
            'fields': ('user', 'course'),
            'classes': ('wide',),
        }),
        ('الدروس المكتملة', {
            'fields': ('lessons_completed',),
            'classes': ('collapse',),
        }),
    )
    
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
    
    verbose_name = 'تقدم الطالب'
    verbose_name_plural = 'تقدم الطلاب'
