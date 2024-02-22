from django.shortcuts import render

# Create your views here.
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from .models import Answer, Question


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


class GameView(generic.View):
    template_name = "ZenSpelling/gamePage.html"


def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_option = question.answer_set.get(pk=request.POST["answer"])
    except (KeyError, Answer.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "ZenSpelling/detail.html",
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
