from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from .models import Answer, Question, User, Course
from .forms import LoginForm


class IndexView(generic.ListView):
    template_name = "ZenSpelling/index.html"
    context_object_name = "hardest_question_list"

    def get_queryset(self):
        return Question.objects.all().order_by("-times_correct")[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = "ZenSpelling/detail.html"

    def get_queryset(self):
        """
        Excludes any questions that aren't published yet.
        """
        return Question.objects.all()


class ResultsView(generic.DetailView):
    model = Question
    template_name = "ZenSpelling/results.html"


class LoginView(generic.FormView):
    form_class = LoginForm
    template_name = "ZenSpelling/LoginPage.html"
    success_url = "/start/"

    def form_valid(self, form):
        return super().form_valid(form)


class StartView(generic.TemplateView):
    template_name = "ZenSpelling/StartPage.html"


class SetupView(generic.TemplateView):
    template_name = "ZenSpelling/GameSetUp.html"


class GameView(generic.TemplateView):
    template_name = "ZenSpelling/gamePage.html"


