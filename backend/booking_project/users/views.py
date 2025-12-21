from rest_framework import generics
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from . serializers import CustomUserRegisterSerializer, MyTokenObtainPairSerializer, CustomUserUpdateSerializer, PasswordChangeSerializer
from . models import RefreshTokenModels, CustomUser

from django.contrib.auth import get_user_model
User = get_user_model()


class CustomUserRegisterView(generics.CreateAPIView):
    serializer_class = CustomUserRegisterSerializer
    permission_classes = [AllowAny]


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            if serializer.is_valid(raise_exception=True):
                return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f'Login error: {e}')
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            auth_headers = request.headers.get('Authorization')
            if auth_headers is None:
                return Response({'error': 'Authorization headers missing'}, status=status.HTTP_400_BAD_REQUEST)
            access_token = auth_headers.split(' ')[1]
            print(f'access token {access_token}')
            print(f'user {request.user}')

            user = request.user
            refresh_token_instances = RefreshTokenModels.objects.filter(user=user)
            for refresh_token_instance in refresh_token_instances:
                refresh_token = refresh_token_instance.token
                token = RefreshToken(refresh_token)
                token.blacklist()
                refresh_token_instance.delete()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except RefreshTokenModels.DoesNotExist:
            return Response({'error': 'Refresh tokrn dont found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)





class Refresh(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.data.get('user_id')
            print(request)
            if not user_id:
                return Response({"error": "user id is Required"}, status=status.HTTP_400_BAD_REQUEST)

            user = CustomUser.objects.get(id=user_id)
            refresh_token_instance = RefreshTokenModels.objects.get(user=user)
            refresh_token = refresh_token_instance.token

            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            data = {
                'access': access_token
            }
            return Response(data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except RefreshTokenModels.DoesNotExist:
            return Response({"error": "Refresh token not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class CustomUserUpdateView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user



class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
# from .models import RefreshTokenModels
# from django.utils.timezone import now
#
# class TokenRefreshView(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self, request, *args, **kwargs):
#         try: # Получаем текущего пользователя
#             user = request.user
#             # Ищем Refresh Token в базе данных
#             refresh_token_instance = RefreshTokenModels.objects.get(user=user)
#              refresh_token = refresh_token_instance.token
#             # Создаем объект
#              RefreshToken refresh = RefreshToken(refresh_token)
#             # Проверяем истек ли токен if refresh.check_exp():
#             # Генерация нового access token
#              new_access_token = refresh.access_token
#              return Response({'access': str(new_access_token)}, status=status.HTTP_200_OK) else: return Response({"detail": "Refresh token expired."}, status=status.HTTP_401_UNAUTHORIZED)
#         except RefreshTokenModels.DoesNotExist:
#              return Response({"detail": "Refresh token not found for user."}, status=status.HTTP_400_BAD_REQUEST) except Exception as e: return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)






