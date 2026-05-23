import { getBookingPaymentUrl } from './bookingApi';

export const createStripeCheckOutSession = async ({ id, formData }) => {
  try {
    const response = await getBookingPaymentUrl(id, formData);
    console.log(response);

    const { checkout_url } = response.data;
    window.open(checkout_url, '_blank');
  } catch (error) {
    console.error('error data', error);
  }
};
