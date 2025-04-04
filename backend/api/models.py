from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, username, phone, password=None, role="user"):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, phone=phone, role=role)
        user.set_password(password)  
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, phone, password=None):
        """ Used by Django's createsuperuser command """
        user = self.create_user(email, username, phone, password, role="superadmin")
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

    def create_admin(self, email, username, phone, password=None):
        user = self.create_user(email, username, phone, password, role="admin")
        user.is_staff = True
        user.save(using=self._db)
        return user


from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, username, phone, password=None, role="user"):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, phone=phone, role=role)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, phone, password=None):
        user = self.create_user(email, username, phone, password, role="superadmin")
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("superadmin", "Super Admin"),
        ("admin", "Admin"),
        ("user", "User"),
    ]

    email = models.EmailField(max_length=250, unique=True)
    username = models.CharField(max_length=250, unique=True)
    phone = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "phone"]
    
    

    def __str__(self):
        return f"{self.username} ({self.role})"
