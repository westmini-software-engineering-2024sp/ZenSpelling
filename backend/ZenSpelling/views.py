from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from .models import Answer, Question, Student, Course, Tile
from .forms import LoginForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.mixins import LoginRequiredMixin


class IndexView(generic.ListView):
    template_name = "ZenSpelling/index.html"
    context_object_name = "hardest_question_list"

    def get_queryset(self):
        return Question.objects.all().order_by("-times_correct")[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = "ZenSpelling/question.html"

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
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']

        user = authenticate(self.request, username=username, password=password)

        if user is not None:
            login(self.request, user)
            return super().form_valid(form)
        else:
            print("Invalid username or password")
            form.add_error(None, "Invalid username or password")
            return self.form_invalid(form)


class StartView(LoginRequiredMixin, generic.TemplateView):
    login_url = "/"
    template_name = "ZenSpelling/StartPage.html"


class SetupView(LoginRequiredMixin, generic.TemplateView):
    login_url = "/"
    template_name = "ZenSpelling/GameSetUp.html"


class GameView(LoginRequiredMixin, generic.TemplateView):
    login_url = "/"
    template_name = "ZenSpelling/gamePage.html"


class CompleteView(LoginRequiredMixin, generic.TemplateView):
    login_url = "/"
    template_name = "ZenSpelling/complete.html"


def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_option = question.answer_set.get(pk=request.POST["answer"])
    except (KeyError, Answer.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "ZenSpelling/question.html",
            {
                "question": question,
                "error_message": "You didn't select an option.",
            },
        )
    else:
        selected_option.votes += 1
        selected_option.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse("ZenSpelling:results", args=(question.id,)))


def tile_paths(request):
    file_paths = list(Tile.objects.values_list('path', flat=True))
    return JsonResponse({'tile_paths': file_paths})
