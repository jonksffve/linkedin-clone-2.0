from django.urls import path, include
from . import views

urlpatterns = [
    path("account/", views.UserCreationView.as_view(), name="register"),
    path(
        "account/profile/", views.UserRetrieveInformationView.as_view(), name="profile"
    ),
    path(
        "account/profile/edit/", views.UserUpdateView.as_view(), name="profile-update"
    ),
    path(
        "account/profile/edit/avatar/",
        views.UserUpdateAvatarView.as_view(),
        name="profile-avatar-update",
    ),
    path(
        "account/profile/edit/banner/",
        views.UserUpdateBannerView.as_view(),
        name="profile-banner-update",
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
    path("comment/", views.CommentListCreateView.as_view(), name="comment-list-create"),
    path(
        "comment/like/",
        views.CommentLikeCreateView.as_view(),
        name="comment-like-create",
    ),
    path(
        "comment/like/<str:comment>/",
        views.CommentLikeDestroyView.as_view(),
        name="comment-like-destroy",
    ),
]
