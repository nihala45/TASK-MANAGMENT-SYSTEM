from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'phone', 'password', 'is_active', 'is_superuser' ]


    def create(self, validated_data):
        print('creating user data', validated_data)
        password = validated_data.pop('password', None)
        instance = User.objects.create(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        print(validated_data)
        for key, value in validated_data.items():
            if key == "password":
                instance.set_password(value)
            else:
                setattr(instance,key,value)
        instance.save()
        return instance