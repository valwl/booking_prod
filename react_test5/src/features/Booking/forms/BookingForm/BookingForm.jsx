import { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import { useBookingForm } from '../../hooks/useBookingForm';
import styles from './BookingForm.module.scss';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

const BookingForm = ({ apartmentId, apartment }) => {
  // 1️⃣ Получаем логику из хука
  const {
    formData,
    loading,
    error,
    updateDates,
    updateGuests,
    clear,
    submit,
    isDayBlocked,
    isOutsideRange,
    focusedInput,
    setFocusedInput,
  } = useBookingForm(apartmentId, apartment);



  const [showGuests, setShowGuests] = useState(false);


  return (
    <div className={styles.bookingFormContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <DateRangePicker
          startDate={formData.checkin_day}
          startDateId="start_date_id"
          endDate={formData.checkout_day}
          endDateId="end_date_id"
          //onDatesChange={updateDates}
          onDatesChange={({ startDate, endDate }) =>
            updateDates(startDate, endDate)
          }
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          isDayBlocked={isDayBlocked}
          isOutsideRange={isOutsideRange}
          numberOfMonths={1}
          hideKeyboardShortcutsPanel
        />

        <div>
          <label onClick={() => setShowGuests(!showGuests)}>Guest</label>
          {showGuests && (
            <div className={styles.guestCountContainer}>
              <div>
                <label>Adults</label>
                <input
                  type="number"
                  value={formData.guests.adults}
                  onChange={(e) => updateGuests('adults', e.target.value)}
                />
              </div>

              <div>
                <label>Children</label>
                <input
                  type="number"
                  value={formData.guests.children}
                  onChange={(e) => updateGuests('children', e.target.value)}
                />
              </div>

              <div>
                <label>Pets</label>
                <input
                  type="number"
                  value={formData.guests.pets}
                  onChange={(e) => updateGuests('pets', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.totalPrice}>
          <label>Total Price: ${formData.total_price}</label>

          <button type="button" onClick={clear}>
            Clear
          </button>
        </div>
        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Book'}
        </button>
        {/* Error */}
        {error && <p>{error}</p>} 
      </form>
    </div>
  );
};

export default BookingForm;
