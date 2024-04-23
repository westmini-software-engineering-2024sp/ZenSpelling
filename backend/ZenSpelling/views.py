import json

from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from .models import Answer, Question, Student, Course, Tile, QuestionSet, StudentAnalytics
from .forms import LoginForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.conf import settings
from django.db import transaction


class DetailView(generic.DetailView):
    model = Question
    template_name = "ZenSpelling/question.html"

    def get_queryset(self):
        return Question.objects.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        question = self.get_object()
        user = self.request.user

        context["question"] = question
        context["hint"] = question.hint

        #check if the row exists
        if StudentAnalytics.objects.filter(user=user, question=question).exists():
            analytic = StudentAnalytics.objects.get(user=user, question=question)
            context['show_hint'] = analytic.hint
            return context
        else:
            return context


class ResultsView(generic.DetailView):
    model = Question
    template_name = "ZenSpelling/results.html"


class LoginView(generic.FormView):
    form_class = LoginForm
    template_name = "ZenSpelling/loginPage.html"
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
    template_name = "ZenSpelling/startPage.html"


class SetupView(LoginRequiredMixin, generic.TemplateView):
    login_url = "/"
    template_name = "ZenSpelling/gameSetUp.html"
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

    def medals(self):
        return (Student.objects.filter(user=self.request.user).get(Student.time_medal),
                Student.objects.filter(user=self.request.user).get(Student.percent_medal),
                Student.objects.filter(user=self.request.user).get(Student.streak_medal),)


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
    return render(request, 'ZenSpelling/gameSetUp.html', {'question_sets': question_sets})


def gamepagesetup_counts(request):
    tile_count = Tile.objects.count()
    question_count = Question.objects.count()
    return JsonResponse({'tile_count': tile_count, 'question_count': question_count})


# question.html form
def submit_answer(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            answer_id = data.get('answer')

            with transaction.atomic():
                answer_exists = Answer.objects.filter(
                    id=answer_id,
                    correct=True
                ).exists()

                # using answer to get the questionPK
                answer = Answer.objects.select_for_update().get(id=answer_id)
                question = answer.question  # question object

                # code to update the Question table's times_answer and times_correct
                question.times_answered += 1
                if answer_exists:
                    question.times_correct += 1

                question.save()

                # user object
                user = request.user

                if StudentAnalytics.objects.filter(user=user, question=question).exists():
                    analytic = StudentAnalytics.objects.get(user=user, question=question)

                    correct = analytic.times_correct

                    analytic.times_answered += 1
                    analytic.times_correct = correct + 1 if answer_exists else correct
                    analytic.hint = not answer_exists
                    analytic.save()
                else:
                    analytic = StudentAnalytics.objects.create(
                        user=user,
                        question=question,
                        times_answered=1,
                        times_correct=1 if answer_exists else 0,
                        hint=not answer_exists
                    )
                    analytic.save()

            return JsonResponse({'exists': answer_exists})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            # For production, consider logging the error
            return JsonResponse({'error': 'An error occurred.'}, status=500)
    else:
        return JsonResponse({'error': 'This endpoint only supports POST requests.'}, status=405)


def update_profile(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            time = data['timeSpent']
            count = data['questionCount']
            correct = data['questionCorrect']
            streak = data['streak']

            user = request.user

            with transaction.atomic():
                if Student.objects.filter(user=user).exists():
                    profile = Student.objects.get(user=user)
                    profileStreak = profile.streak  # get streak number from profile
                    profileMinTime = profile.min_time  # get min time from profile

                    profile.time_spent += time
                    profile.questions_answered += count
                    profile.questions_correct += correct
                    profile.games_completed += 1
                    if streak > profileStreak:
                        profile.streak = streak

                    if time < profileMinTime:
                        profile.min_time = time

                    profile.save()
                else:
                    profile = Student.objects.create(
                        user=user,
                        time_spent=time,
                        questions_answered=count,
                        questions_correct=correct,
                        games_completed=1,
                        streak=streak,
                        minTime=time
                    )
                    profile.save()

            return JsonResponse({"exists": True})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            # For production, consider logging the error
            return JsonResponse({'error': 'An error occurred.'}, status=500)
    else:
        return JsonResponse({'error': 'This endpoint only supports POST requests.'}, status=405)


def generate_questions(request):
    if request.method == 'GET':
        print("Entering if")
        question_set_id = request.GET.get('question_set_id')
        sidelength = int(request.GET.get('sidelength', 3))  # Default sidelength is 3
        question_set = get_object_or_404(QuestionSet, id=question_set_id)
        questions = question_set.questions.all()  # Assuming questions is a related_name for the questions in QuestionSet
        selected_questions = list(questions.values())  # Convert QuerySet to list of dictionaries
        # You can perform any further processing on selected_questions here, like shuffling

        # Prepare the response
        response_data = {
            'questions': questions,
            'sidelength': sidelength
        }
        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Only GET requests are allowed.'})

# Fetches question-set list of question id's.
def fetch_question_set(request):
    if request.method == 'GET' and 'question_set_id' in request.GET:
        question_set_id = request.GET.get('question_set_id')
        try:
            question_set = QuestionSet.objects.get(id=question_set_id)
            data = {
                'questions': list(question_set.questions.values('id'))
            }
            return JsonResponse(data)
        except QuestionSet.DoesNotExist:
            return JsonResponse({'error': 'Question set not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
