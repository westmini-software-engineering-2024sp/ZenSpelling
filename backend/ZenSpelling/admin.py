from django.contrib import admin
from django.contrib.auth.models import User
from django.forms import forms
from import_export.admin import ImportMixin
from .models import Answer, Question, Course, Tile, QuestionSet, Student


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
        (None, {"fields": [("name", "course"), "questions"]})
    ]
    list_display = ["name"]
    search_fields = ["name"]


class UserAdmin(ImportMixin, admin.ModelAdmin):
    pass


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Course)
admin.site.register(Tile)
admin.site.register(Student)
admin.site.register(QuestionSet, AddQuestionSet)
