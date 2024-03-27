from django.contrib import admin
from django.contrib.auth.admin import User, UserAdmin as BaseUserAdmin
from .models import Answer, Question, Course, Tile, QuestionSet, Student


class UserAdmin(BaseUserAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(Course=request.user.student.course)


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4


class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["question_text"]}),
        ("Other information", {"fields": ["course"], "classes": ["collapse"]}),
    ]
    inlines = [AnswerInline]
    list_display = ["question_text", "percent_correct"]
    search_fields = ["question_text"]


class AddQuestionSet(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": [("name", "course"), "questions"]})
    ]
    list_display = ["name"]
    search_fields = ["name"]


admin.site.site_header = "Teacher View"
#admin.site.register(UserAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Course)
admin.site.register(Tile)
admin.site.register(Student)
admin.site.register(QuestionSet, AddQuestionSet)
