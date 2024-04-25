from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.forms import forms
from import_export.admin import ImportMixin
from import_export import resources
from .models import Answer, Question, Course, Tile, QuestionSet, Student, StudentAnalytics


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
    list_display = ["question_text", "percent_correct", "hint"]
    search_fields = ["question_text"]


class AddQuestionSet(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": [("name", "course"), "questions"]})
    ]
    list_display = ["name"]
    search_fields = ["name"]


class UserResource(resources.ModelResource):

    # def before_import(self, dataset, **kwargs):
    #     setattr(dataset, "username", dataset['last_name']+dataset['first_name'])

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'password', 'email',)
        import_id_fields = ('username',)


class UserAdminCustom(ImportMixin, UserAdmin):
    resource_classes = [UserResource]


class StudentAnalyticsAdmin(admin.ModelAdmin):
    list_display = ["__str__", "percent_correct", "hint"]


admin.site.unregister(User)
admin.site.register(User, UserAdminCustom)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Course)
admin.site.register(Tile)
admin.site.register(Student)
admin.site.register(QuestionSet, AddQuestionSet)
admin.site.register(StudentAnalytics, StudentAnalyticsAdmin)

