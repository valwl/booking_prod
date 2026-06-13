from django.db import transaction
from apartments.models.apartments import Apartment, ApartmentImg


@transaction.atomic
def update_apartment(*, apartment, data, request):
    # new_images = data.pop('images', [])
    new_images = request.FILES.getlist("images")
    removed_images = data.pop('removed_images', [])

    # update scalar fields
    for field, value in data.items():
        setattr(apartment, field, value)
    apartment.save()

    if removed_images:
        apartment.images.filter(id__in=removed_images).delete()

    ApartmentImg.objects.bulk_create([
        ApartmentImg(apartment=apartment, img=image)
        for image in new_images
    ])
    return apartment


