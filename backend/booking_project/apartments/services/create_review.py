from django.db import transaction
from apartments.models.apartments import  Apartment
from apartments.models.reviews import  Review


@transaction.atomic
def create_review(*, user, apartment_id, data):
    apartment = Apartment.objects.get(id=apartment_id)

    # future invariant:

    # if Review.objects.filter(user=user, apartment=apartment).exists():

    #     raise DomainError("Review already exists")



    review = Review.objects.create(
        user=user,
        apartment=apartment,
        **data
    )

    # future:
    # update_apartment_rating(apartment)

    return review
