from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


class TokenService:
    @staticmethod
    def issue_tokens_for_user(user) -> dict:
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


    @staticmethod
    def refresh(refresh_token: str) -> dict:
        try:
            refresh = RefreshToken(refresh_token)
            return {
                "access": str(refresh.access_token)
            }
        except TokenError:
            raise ValueError("Invalid refresh token")


    @staticmethod
    def blacklist(refresh_token: str) -> None:
        try:
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            raise ValueError("Invalid refresh token")

# нужен ли данный метод и если да то для чего
    @staticmethod
    def validate_refresh(refresh_token: str) -> bool:
        try:
            RefreshToken(refresh_token)
            return True
        except TokenError:
            return False
