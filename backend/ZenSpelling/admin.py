from django.contrib import admin

from .models import Answer, Question, Course, Tile, MultipleQuestion, QuestionSet


admin.site.site_header = "Teacher View"


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
        (None, {"fields": ["name", "course"]})
    ]


admin.site.register(Question, QuestionAdmin)
admin.site.register(Course)
admin.site.register(Tile)
admin.site.register(AddQuestionSet)


