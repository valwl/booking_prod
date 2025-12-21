from rest_framework import serializers
from . models import Booking, Payment, UnavailableDate


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        if data['checkin_day'] >= data['checkout_day']:
            raise serializers.ValidationError('end date must be after start date')

        overlapping_bookings = UnavailableDate.objects.filter(
            apartment=data['apartment'],
            date__gte=data['checkin_day'],
            date__lt=data['checkout_day'],
        )
        if overlapping_bookings.exists():
            raise serializers.ValidationError('The apartment is already booked for these dates')
        return data

    def create(self, validated_data):
        return Booking.objects.create(**validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class BooingDetailSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

