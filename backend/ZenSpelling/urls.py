from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

app_name = "ZenSpelling"
urlpatterns = [
    path("", views.LoginView.as_view(), name="LoginPage"),
    path("start/", views.StartView.as_view(), name="StartPage"),
    path("setup/", views.SetupView.as_view(), name="GameSetUp"),
    path("game/", views.GameView.as_view(), name="gamePage"),
    path("complete/", views.CompleteView.as_view(), name="complete"),
    path("ZenSpelling/", views.IndexView.as_view(), name="index"),
    path("ZenSpelling/<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("ZenSpelling/<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("ZenSpelling/<int:question_id>/vote/", views.vote, name="vote"),
    path("tilepaths/", views.tile_paths, name="tilePaths"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
