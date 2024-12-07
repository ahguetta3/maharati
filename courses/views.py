from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Course, Lesson, Progress
from .forms import CourseCreateForm

@login_required
def course_list(request):
    enrolled_courses = Course.objects.filter(students=request.user)
    available_courses = Course.objects.exclude(students=request.user)
    context = {
        'enrolled_courses': enrolled_courses,
        'available_courses': available_courses
    }
    return render(request, 'courses/course_list.html', context)

@login_required
def course_detail(request, pk):
    course = get_object_or_404(Course, pk=pk)
    progress = Progress.objects.filter(user=request.user, course=course).first()
    if not progress and course.students.filter(id=request.user.id).exists():
        progress = Progress.objects.create(user=request.user, course=course)
    
    context = {
        'course': course,
        'progress': progress
    }
    return render(request, 'courses/course_detail.html', context)

@login_required
def enroll_course(request, pk):
    course = get_object_or_404(Course, pk=pk)
    if request.user not in course.students.all():
        course.students.add(request.user)
        Progress.objects.create(user=request.user, course=course)
        messages.success(request, f'تم تسجيلك في دورة {course.title} بنجاح!')
    return redirect('course_detail', pk=pk)

@login_required
def mark_lesson_complete(request, course_pk, lesson_pk):
    course = get_object_or_404(Course, pk=course_pk)
    lesson = get_object_or_404(Lesson, pk=lesson_pk, course=course)
    progress = get_object_or_404(Progress, user=request.user, course=course)
    
    if lesson not in progress.lessons_completed.all():
        progress.lessons_completed.add(lesson)
        messages.success(request, 'تم تحديث تقدمك في الدورة!')
    
    return redirect('course_detail', pk=course_pk)

@login_required
def create_course(request):
    if request.method == 'POST':
        form = CourseCreateForm(request.POST, request.FILES)
        if form.is_valid():
            course = form.save(commit=False)
            course.instructor = request.user
            course.save()
            messages.success(request, 'تم إنشاء الدورة بنجاح!')
            return redirect('course_detail', pk=course.pk)
    else:
        form = CourseCreateForm()
    
    return render(request, 'courses/course_form.html', {'form': form, 'title': 'إنشاء دورة جديدة'})
