


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

class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImgSerializer(many=True, read_only=True)

    class Meta:
        model = Apartment
        fields = ['id', 'title', 'description', 'base_price', 'weekend_price', 'images', 'user', 'location']





class ApartmentUpdateSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    removed_images = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Apartment
        fields = ['title', 'description', 'base_price', 'weekend_price', 'images', 'removed_images']

    def get_images(self, instance):
        return [{'id': image.id, 'url': image.img.url} for image in instance.images.all()]

    def update(self, instance, validated_data):
        request = self.context['request']
        new_images = request.FILES.getlist('images')
        removed_images = validated_data.pop('removed_images', [])


        # Обновляем текстовые поля
        instance.description = validated_data.get('description', instance.description)
        instance.title = validated_data.get('title', instance.title)
        instance.base_price = validated_data.get('base_price', instance.base_price)
        instance.weekend_price = validated_data.get('weekend_price', instance.weekend_price)
        instance.save()

        # Удаляем изображения
        if removed_images:
            instance.images.filter(id__in=removed_images).delete()
        print(removed_images)

        # Добавляем новые изображения
        for image in new_images:
            print(image)
            ApartmentImg.objects.create(apartment=instance, img=image)

        return instance



class ApartmentUpdateView(generics.UpdateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentUpdateSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

