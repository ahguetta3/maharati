from django import forms
from .models import Course

class CourseCreateForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'description', 'image', 'total_hours', 'total_lessons']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'عنوان الدورة'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'وصف الدورة', 'rows': 4}),
            'total_hours': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'عدد الساعات'}),
            'total_lessons': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'عدد الدروس'}),
        }
        labels = {
            'title': 'عنوان الدورة',
            'description': 'وصف الدورة',
            'image': 'صورة الدورة',
            'total_hours': 'عدد الساعات',
            'total_lessons': 'عدد الدروس',
        }
