class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    date_join = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def __str__(self):
        return self.email if self.email else self.phone_number


class CustomUserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['phone_number', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        print("Validated data:", validated_data)
        user = User.objects.create_user(
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        refresh = RefreshToken.for_user(user)
        RefreshTokenModels.objects.create(user=user, token=str(refresh))
        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        refresh = RefreshToken.for_user(instance)
        representation['access'] = str(refresh.access_token)
        representation['refresh'] = str(refresh)
        return representation



# ?

class CustomUserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['phone_number', 'email', 'password', 'first_name', 'last_name']



    def create(self, validated_data):
        print("Validated data:", validated_data)
        user = User.objects.create_user(
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        refresh = RefreshToken.for_user(user)
        RefreshTokenModels.objects.create(user=user, token=str(refresh))
        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        refresh = RefreshToken.for_user(instance)
        representation['access'] = str(refresh.access_token)
        representation['refresh'] = str(refresh)
        return representation
