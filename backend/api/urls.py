from django.urls import path, include
from . import views

urlpatterns = [
    path("account/", views.UserCreationView.as_view(), name="register"),
    path(
        "account/profile/",
        views.UserRetrieveInformationView.as_view(),
        name="profile",
    ),
    path("login/", views.LoginView.as_view(), name="login"),
    path("auth/", include("knox.urls")),
    path("post/", views.PostListCreateView.as_view(), name="post-list-create"),
    path("post/like/", views.PostLikeCreateView.as_view(), name="post-like-create"),
    path(
        "post/like/<str:post>/",
        views.PostLikeDestroyView.as_view(),
        name="post-like-destroy",
    ),
]
