from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    # confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['phone_number', 'email', 'first_name', 'last_name',  'password', ]
        extra_kwargs = {'password': {'write_only': True}}

    # def validate(self, data):
    #     if data['password'] != data.pop('confirm_password'):
    #         raise serializers.ValidationError('Passwords do not match')
    #     return data


# class RegisterSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)
#     first_name = serializers.CharField()
#     last_name = serializers.CharField()



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



class PasswordChangeSerializer(serializers.Serializer):
    new_password = serializers.CharField()



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'first_name', 'last_name', 'photo', 'password']
        read_only_fields = ('id', 'email', 'phone_number')


class UserPublicSerializer(serializers.Serializer):
    pass


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'phone_number'
        )


class UserUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'phone_number'
        )










