from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Post(models.Model):
    user = models.ForeignKey(
        "accounts.Customuser",
        verbose_name=_("creator"),
        related_name="posts",
        on_delete=models.CASCADE,
    )
    title = models.CharField(_("title"), max_length=50)
    content = models.TextField(_("content"))
    date_created = models.DateTimeField(
        _("date created"), auto_now=False, auto_now_add=True
    )
    image = models.ImageField(
        _("image"),
        upload_to="post/image/",
        blank=True,
        null=True,
    )
    video = models.FileField(_("video"), upload_to="post/video/", null=True, blank=True)

    def __str__(self):
        return f"{self.user} posted: {self.title} - {self.date_created}"


class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        verbose_name=_("Comment"),
        related_name="comments",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        "accounts.CustomUser", verbose_name=_("Comment user"), on_delete=models.CASCADE
    )
    content = models.TextField(_("Comment content"))
    date_created = models.DateTimeField(_("Comment date"), auto_now_add=True)
    parent = models.ForeignKey(
        "self",
        verbose_name=_("Comment reply"),
        related_name="replies",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
    )

    class Meta:
        ordering = ["-date_created"]

    def __str__(self):
        return f"{self.user} comment on: {self.post}"


class PostLike(models.Model):
    post = models.ForeignKey(
        Post,
        verbose_name=_("Post likes"),
        related_name="likes",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        "accounts.CustomUser", verbose_name=_("User"), on_delete=models.CASCADE
    )
    date_like = models.DateTimeField(_("Like date"), auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post", "user"], name="unique_like_post")
        ]

    def __str__(self):
        return f"{self.user} liked: {self.post}"


class CommentLike(models.Model):
    comment = models.ForeignKey(
        Comment,
        verbose_name=_("Comment likes"),
        related_name="likes",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        "accounts.CustomUser", verbose_name=_("User"), on_delete=models.CASCADE
    )
    date_like = models.DateTimeField(_("Like date"), auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["comment", "user"], name="unique_like_comment"
            )
        ]

    def __str__(self):
        return f"{self.user} liked comment: {self.comment}"
