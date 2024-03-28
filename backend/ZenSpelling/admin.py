from django.contrib import admin
from .models import Answer, Question, Course, Tile, QuestionSet, Student


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

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs if request.user.is_superuser else qs.filter(course__is=request.user.get_course())


class AddQuestionSet(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": [("name", "course"), "questions"]})
    ]
    list_display = ["name"]
    search_fields = ["name"]


admin.site.site_header = "Teacher View"
admin.site.register(Question, QuestionAdmin)
admin.site.register(Course)
admin.site.register(Tile)
admin.site.register(Student)
admin.site.register(QuestionSet, AddQuestionSet)
