from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User
from .models import Task
from .models import AdminAssignedToTask

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
    class Meta:
        model = Task
        fields = '__all__' 
        
        
class AdminAssignedToTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminAssignedToTask
        fields = ['id', 'title', 'assigned_to']