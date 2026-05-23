import React from 'react';
import styles from './StripeCheckOutButton.module.scss';
import { createStripeCheckOutSession } from '../../services/createStripeCheckOutSession';



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
