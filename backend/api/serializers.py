from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User
from .models import Task

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    phone = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'password',
            'is_active', 'is_superuser', 'role'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.CharField(source='assigned_to.username',  read_only=True)
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'assigned_to',
            'due_date',
            'status',
            'completion_report',
            'worked_hours'
        ]