from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)

    # Override 'groups' and 'user_permissions' to avoid reverse accessor conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Avoids conflict with auth.User
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # Avoids conflict with auth.User
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['username'], name='unique_username'),
            models.UniqueConstraint(fields=['email'], name='unique_email'),
        ]

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.username})"
