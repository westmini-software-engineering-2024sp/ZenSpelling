import json

from django.contrib.auth.models import User
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from .models import Answer, Question, Student, Course, Tile, QuestionSet, StudentAnalytics
from django.contrib.auth.models import User
from .forms import LoginForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.conf import settings
from django.db import transaction, models


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
    bgMusicPath = settings.MEDIA_URL

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
    question_sets = QuestionSet.objects.all()


class GameView(LoginRequiredMixin, generic.TemplateView):
    login_url = "/"
    template_name = "ZenSpelling/gamePage.html"


class CompleteView(LoginRequiredMixin, generic.TemplateView):
    login_url = "/"
    model = Student
    template_name = "ZenSpelling/complete.html"


class ProfileView(LoginRequiredMixin, generic.DetailView):
    login_url = "/"
    template_name = "ZenSpelling/profile.html"
    model = Student

    def get_queryset(self):
        return Student.objects.filter(user=self.request.user)


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


def display_question_sets(request):
    question_sets = QuestionSet.objects.all()
    return render(request, 'ZenSpelling/GameSetUp.html', {'question_sets': question_sets})


# question.html form
def submit_answer(request):
    print(1)
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            answer_id = data.get('answer')
            username = data.get('username')
            print(answer_id + " " + username)

            with transaction.atomic():
                # Retrieve answer and verify correctness
                answer = Answer.objects.select_for_update().get(id=answer_id)
                question = answer.question #question is question_text
                print(question.id)
                answer_correct = answer.correct
                print(answer_correct)

                # Update question statistics
                Question.objects.filter(id=question.id).update(
                    times_answered=models.F('times_answered') + 1,
                    times_correct=models.F('times_correct') + 1 if answer_correct else models.F('times_correct')
                )
                print("check database Question")

                # Retrieve student object using username
                user = User.objects.get(username=username)
                student = Student.objects.get(user=user) #user is the username
                print(student.id)

                # Update student analytics
                analytics_defaults = {
                    'times_answered': models.F('times_answered') + 1,
                    'times_correct': models.F('times_correct') + 1 if answer_correct else models.F('times_correct'),
                    'hint': not answer_correct
                }
                print("hello")
                StudentAnalytics.objects.update_or_create( #something is broken here
                    user=student.id,
                    question=question.id,
                    defaults=analytics_defaults
                )
                print("check database StudentAnalytics")

            return JsonResponse({answer_correct})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Answer.DoesNotExist:
            return JsonResponse({'error': 'Answer not found.'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
        except Student.DoesNotExist:
            return JsonResponse({'error': 'Student not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'This endpoint only supports POST requests.'}, status=405)