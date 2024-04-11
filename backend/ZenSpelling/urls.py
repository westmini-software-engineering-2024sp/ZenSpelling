from django.conf import settings
from django.urls import path
from . import views

app_name = "ZenSpelling"
urlpatterns = [
    path("", views.LoginView.as_view(), name="LoginPage"),
    path("start/", views.StartView.as_view(), name="StartPage"),
    path("game/", views.GameView.as_view(), name="gamePage"),
    path("complete/", views.CompleteView.as_view(), name="complete"),
    path("ZenSpelling/", views.IndexView.as_view(), name="index"),
    path("profile/<string:username>", views.ProfileView.as_view(), name="profile"),
    path("ZenSpelling/<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("ZenSpelling/<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("ZenSpelling/<int:question_id>/vote/", views.vote, name="vote"),
    path("tilepaths/", views.tile_paths, name="tilePaths"),
    path('setup/', views.display_question_sets, name='question_sets'),
    path('game/answer/', views.submit_answer, name='submit_answer'),
]
