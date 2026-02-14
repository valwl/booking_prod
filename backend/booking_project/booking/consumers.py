import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async


class BookingStatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        from rest_framework_simplejwt.tokens import UntypedToken
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        from rest_framework_simplejwt.authentication import JWTAuthentication



        self.booking_id = self.scope["url_route"]["kwargs"]["booking_id"]
        self.group_name = f"booking_{self.booking_id}"
        print("client connect form booking", self.booking_id)

        # уточнить корректность получения токена
        # как сделать аутентификацию по токену, тут аутентификвцию юудет делать не middleware а в ручную

        # query_string = self.scope["query_string"].decode()
        # params = parse_qs(query_string)
        params = parse_qs(self.scope["query_string"].decode())
        token = params.get("token", [None])[0]

        if token is None:
            await self.close()
            return

        try:
            UntypedToken(token)
        except (InvalidToken, TokenError):
            await self.close()
            return

        jwt_auth = JWTAuthentication()
        validated_token = jwt_auth.get_validated_token(token)
        user = await sync_to_async(jwt_auth.get_user)(validated_token)

        self.scope["user"] = user

        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close()
            return

        # TODO: проверить, что user имеет доступ к booking

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name)
        print("client disconnect form booking", self.booking_id)



    async def booking_event(self, event):
        print("booking received ", event)

        await self.send(text_data=json.dumps({

            "type": event["payload"]["type"],

            "data": event["payload"],

        }))

# тип сообщения на стороне канала  что это значит
# а где мы используем send_status_update
# конфигурация django Chanels в это и как посмотреть