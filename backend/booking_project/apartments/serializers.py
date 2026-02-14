from rest_framework import serializers
from . models.apartments import Apartment, ApartmentImg, Locations, SliderImage, PopularApartment
from . models.reviews import Review
from . models.locations import LocationImg

#apartment detail: 3 serializers
class ApartmentImgSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField()

    class Meta:
        model = ApartmentImg
        fields = ['img', 'id']

    def get_img(self, obj):
        request = self.context.get('request')
        if obj.img:
            if request:
                absolute_url = f"{request._current_scheme_host}{obj.img.url}"
                return absolute_url
            return obj.img.url
        return None


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'apartment', 'rating', 'text', 'author']


class ApartmentDetailSerializer(serializers.ModelSerializer):

    images = ApartmentImgSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(
        source='review_set',
        many=True,
        read_only=True
    )

    class Meta:
        model = Apartment
        fields = [
            'id',
            'title',
            'description',
            'base_price',
            'weekend_price',
            'location',
            'user',
            'images',
            'reviews',
        ]


class ReviewCreateInputSerializer(serializers.Serializer):

    rating = serializers.IntegerField(min_value=1, max_value=5)
    text = serializers.CharField()






class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImgSerializer(many=True, read_only=True)

    class Meta:
        model = Apartment
        fields = ['id', 'title', 'description', 'base_price', 'weekend_price', 'images', 'user', 'location']


class ApartmentCreateInputSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    weekend_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    location = serializers.PrimaryKeyRelatedField(queryset=Locations.objects.all())
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False
    )


class ApartmentUpdateInputSerializer(serializers.Serializer):
    title = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    weekend_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    # variant 1
    # images = serializers.ListField(
    #     child=serializers.ImageField(),
    #     required=False
    # )
    # removed_images = serializers.ListField(
    #     child=serializers.IntegerField(),
    #     required=False
    # )


    # variant 2
    images = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ApartmentImg.objects.all(), required=False
    )
    removed_images = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )



# class ApartmentUpdateSerializer(serializers.ModelSerializer):
#     images = serializers.SerializerMethodField()
#     removed_images = serializers.ListField(
#         child=serializers.IntegerField(), write_only=True, required=False
#     )
#
#     class Meta:
#         model = Apartment
#         fields = ['title', 'description', 'base_price', 'weekend_price', 'images', 'removed_images']
#
#     def get_images(self, instance):
#         return [{'id': image.id, 'url': image.img.url} for image in instance.images.all()]
#
#     def update(self, instance, validated_data):
#         request = self.context['request']
#         new_images = request.FILES.getlist('images')
#         removed_images = validated_data.pop('removed_images', [])
#
#
#         # Обновляем текстовые поля
#         instance.description = validated_data.get('description', instance.description)
#         instance.title = validated_data.get('title', instance.title)
#         instance.base_price = validated_data.get('base_price', instance.base_price)
#         instance.weekend_price = validated_data.get('weekend_price', instance.weekend_price)
#         instance.save()
#
#         # Удаляем изображения
#         if removed_images:
#             instance.images.filter(id__in=removed_images).delete()
#         print(removed_images)
#
#         # Добавляем новые изображения
#         for image in new_images:
#             print(image)
#             ApartmentImg.objects.create(apartment=instance, img=image)
#
#         return instance



# тдельно разобрать эти serializers
class LocationsImgSerializers(serializers.ModelSerializer):
    class Meta:
        model = LocationImg
        fields = ['img']


class LocationSerializer(serializers.ModelSerializer):
    images = LocationsImgSerializers(many=True, read_only=True)

    class Meta:
        model = Locations
        fields = ['id', 'name', 'description', 'images']


class SliderImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = SliderImage
        fields = '__all__'


class PopularApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImgSerializer(source='apartment.images', many=True, read_only=True)
    id = serializers.IntegerField(source="apartment.id")
    title = serializers.CharField(source="apartment.title")
    description = serializers.CharField(source="apartment.description")
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, source="apartment.base_price")
    weekend_price = serializers.DecimalField(max_digits=10, decimal_places=2, source="apartment.weekend_price")

    class Meta:
        model = PopularApartment
        fields = ['id', 'title', 'description', 'base_price', 'weekend_price', 'images']


class ReviewSerializers(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'