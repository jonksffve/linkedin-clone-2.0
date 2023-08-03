from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


# Create your models here.
class CustomUser(AbstractUser):
    username = None
    first_name = models.CharField(
        _("first name"), max_length=30, blank=False, null=False
    )
    last_name = models.CharField(
        _("last name"), max_length=150, blank=False, null=False
    )
    email = models.EmailField(
        _("email"),
        blank=False,
        null=False,
        unique=True,
        error_messages={
            "unique": _("user with that email address already exists."),
        },
    )
    avatar = models.ImageField(
        _("avatar image"),
        upload_to="avatar/",
        default="user-placeholder.jpeg",
        blank=True,
        null=True,
    )
    banner = models.ImageField(
        _("banner image"),
        upload_to="avatar/banner/",
        default="banner-placeholder.jpg",
        blank=True,
        null=True,
    )
    title = models.CharField(_("title"), max_length=50)
    description = models.TextField(_("description"))

    objects = CustomUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    @property
    def get_followers(self):
        return self.followers.count()

    @property
    def get_following(self):
        return self.following.count()

    @property
    def get_posts(self):
        return self.posts.count()

    def __str__(self):
        return self.email


class UserFollows(models.Model):
    user = models.ForeignKey(
        CustomUser,
        verbose_name=_("User"),
        related_name="following",
        on_delete=models.CASCADE,
    )
    target_user = models.ForeignKey(
        CustomUser,
        verbose_name=_("Target"),
        related_name="followers",
        on_delete=models.CASCADE,
    )
    date_added = models.DateTimeField(_("Follow date"), auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "target_user"], name="unique_follow"
            )
        ]

        ordering = ["-date_added"]

    def __str__(self):
        return f"{self.user} follows {self.target_user}"
