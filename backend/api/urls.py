from django.urls import path, include
from . import views

urlpatterns = [
    path("account/", views.UserCreationView.as_view()),
    path("login/", views.LoginView.as_view()),
    path("auth/", include("knox.urls")),
]
