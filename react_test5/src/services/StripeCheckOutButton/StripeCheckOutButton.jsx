import React from 'react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import styles from './StripeCheckOutButton.module.scss';
import { createStripeCheckOutSession } from '../createStripeCheckOutSession';

const stripePromise = loadStripe(
  'pk_test_51NwzRzEoF28QzXkJWP2wxv7dHcCqcLV3AQmIy2wUBPjyhz9oo2WlqST3y5i819uKXp9ck8sGTXmsvlIeqphfEWFR00t7v0GCPw'
);

// export const StripeCheckOutButton = ({ bookingId, formData }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handlePayment = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('accessToken');
//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8080/booking_api/bookings/${bookingId}/pay/`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const { session_id } = response.data;

//       const stripe = await stripePromise;

//       const result = await stripe.redirectToCheckout({
//         sessionId: session_id,
//       });
//       window.open(`https://checkout.stripe.com/pay/${session_id}`, '_blank');

//       if (result.error) {
//         console.error(result.error.message);
//       }
//     } catch (error) {
//       console.error('error data', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {error && <p>{error}</p>}
//       <button role="link" onClick={handlePayment} className={styles.button}>
//         {loading ? 'Processing...' : 'Pay now'}
//       </button>
//     </div>
//   );
// };

export const StripeCheckOutButton = ({ id, formData }) => {
  return (
    <div>
      <button
        role="link"
        onClick={() => createStripeCheckOutSession({ id, formData })}
        className={styles.button}
      >
        Pay now
      </button>
    </div>
  );
};
