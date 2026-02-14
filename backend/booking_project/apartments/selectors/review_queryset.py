from apartments.models.reviews import Review


def get_review_list_for_apartment(apartment_id):
    return Review.objects.filter(apartment=apartment_id)