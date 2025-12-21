import json
from channels.generic.websocket import AsyncWebsocketConsumer


# class BookingStatusConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # Получение booking_id из URL
#         self.booking_id = self.scope['url_route']['kwargs']['booking_id']
#         self.room_group_name = f'booking_{self.booking_id}'  # Создание уникальной группы
#
#         # Присоединение к группе
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )
#         await self.accept()  # Подтверждение соединения
#
#     async def disconnect(self, close_code):
#         # Отключение от группы
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )
#
#     # Получение сообщений от WebSocket (если нужно)
#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message = data['message']
#
#         # Отправка сообщения обратно на WebSocket (необязательно)
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))
#
#     # Отправка сообщения группе
#     async def booking_status(self, event):
#         message = event['message']
#         # Отправка сообщения обратно клиенту
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))



class BookingStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.booking_id = self.scope['url_route']['kwargs']['booking_id']
        self.room_group_name = f'booking_{self.booking_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name # error here ?
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def booking_status(self, event):
        status = event['status']
        await self.send(text_data=json.dumps({
            'status': status
        }))


# тип сообщения на стороне канала  что это значит
# а где мы используем send_status_update
# конфигурация django Chanels в это и как посмотреть