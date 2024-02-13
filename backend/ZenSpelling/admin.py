from django.contrib import admin

from .models import Answer, Question


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4


class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["question_text"]}),
        ("Other information", {"fields": ["correct_answer"], "classes": ["collapse"]}),
    ]
    inlines = [AnswerInline]
    list_display = ["question_text", "correct_answer", "percent_correct"]
    search_fields = ["question_text"]


admin.site.register(Question, QuestionAdmin)


