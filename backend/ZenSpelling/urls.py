from django.urls import path

from . import views

app_name = "ZenSpelling"
urlpatterns = [
    path("", views.StartView.as_view(), name="LoginPage"),
    path("Zenspelling/", views.IndexView.as_view(), name="index"),
    path("Zenspelling/<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("Zenspelling/<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("Zenspelling/<int:question_id>/vote/", views.vote, name="vote"),
]