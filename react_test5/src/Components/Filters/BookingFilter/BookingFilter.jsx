import React from 'react';

const BookingFilter = ({ filterChange }) => {
  const [status, setStatus] = useState('all');

  const handleFilterChange = () => {
    onFilterChange(filterChange);
  };

  return (
    <div>
      <h2>Booking filter</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(), handleFilterChange();
        }}
      >
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <options value="all">all</options>
            <options value="future">future</options>
            <options value="complete">complete</options>
          </select>
        </div>
        <button type="submit">Apply filter</button>
      </form>
    </div>
  );
};
export default BookingFilter;