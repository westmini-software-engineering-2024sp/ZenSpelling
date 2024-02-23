from django.urls import path
from .views import play_game

from . import views

app_name = "ZenSpelling"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("<int:question_id>/vote/", views.vote, name="vote"),
    path("game/", views.GameView.as_view(), name="GameView"),
    path('play/', play_game, name='play_game'),
]
