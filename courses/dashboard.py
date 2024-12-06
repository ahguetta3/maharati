from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import Course, Lesson, Progress
from django.contrib.auth.models import User

def get_dashboard_stats():
    """جلب الإحصائيات الرئيسية للوحة التحكم"""
    stats = {
        'total_users': User.objects.count(),
        'total_courses': Course.objects.count(),
        'total_lessons': Lesson.objects.count(),
        'active_courses': Course.objects.filter(students__isnull=False).distinct().count(),
        'total_progress': Progress.objects.count(),
    }
    
    # إحصائيات الأسبوع الحالي
    week_ago = timezone.now() - timedelta(days=7)
    stats.update({
        'new_users_week': User.objects.filter(date_joined__gte=week_ago).count(),
        'new_courses_week': Course.objects.filter(created_at__gte=week_ago).count(),
    })
    
    # أكثر الدورات نشاطاً
    stats['top_courses'] = Course.objects.annotate(
        student_count=Count('students')
    ).order_by('-student_count')[:5]
    
    # متوسط تقدم الطلاب
    progress_avg = Progress.objects.all()
    if progress_avg:
        total_percentage = sum(p.get_progress_percentage() for p in progress_avg)
        stats['average_progress'] = total_percentage / progress_avg.count()
    else:
        stats['average_progress'] = 0
    
    return stats

def get_course_statistics(course_id):
    """جلب إحصائيات تفصيلية لدورة معينة"""
    course = Course.objects.get(id=course_id)
    
    # إحصائيات أساسية
    stats = {
        'total_students': course.students.count(),
        'total_lessons': course.lessons.count(),
        'completion_rate': 0,
        'student_progress': []
    }
    
    # حساب تقدم كل طالب
    for student in course.students.all():
        progress, created = Progress.objects.get_or_create(
            user=student,
            course=course,
            defaults={'last_accessed': timezone.now()}
        )
        
        percentage = progress.get_progress_percentage()
        stats['student_progress'].append({
            'student': student.username,
            'percentage': percentage,
            'last_access': progress.last_accessed
        })
    
    # حساب نسبة إكمال الدورة
    if stats['student_progress']:
        completed = sum(1 for p in stats['student_progress'] if p['percentage'] == 100)
        stats['completion_rate'] = (completed / len(stats['student_progress'])) * 100 if completed > 0 else 0
    
    return stats
