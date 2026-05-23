import moment from 'moment';

export const calculateTotalPrice = (
  checkInDay,
  checkOutDay,
  basePrice,
  weekendPrice
) => {
  if (!checkInDay || !checkOutDay) {
    console.log('checkin day or checkout day is missing');
    return 0;
  }

  basePrice = parseFloat(basePrice);
  weekendPrice = parseFloat(weekendPrice);

  if (isNaN(basePrice) || isNaN(weekendPrice)) {
    console.log('invalid base price or weekend price');
    return 0;
  }

  let currentDate = moment(checkInDay);
  const endDate = moment(checkOutDay).subtract(1, 'day');
  let totalPrice = 0;

  console.log(
    `Calculate total price form ${moment(checkInDay).format(
      'YYYY-MM-DD'
    )} to ${moment(checkOutDay).format('YYYY-MM-DD')}`
  );

  console.log(`base price: ${basePrice} ${weekendPrice}`);

  while (currentDate.isSameOrBefore(endDate, 'day')) {
    const dayOfWeek = currentDate.day();
    if (dayOfWeek >= 0 && dayOfWeek <= 4) {
      totalPrice += basePrice;
    } else {
      totalPrice += weekendPrice;
    }
    console.log(
      `Date: ${currentDate.format(
        'YYYY-MM-DD'
      )}, day of week ${dayOfWeek}, total price: ${totalPrice}`
    );
    currentDate = currentDate.add(1, 'day');
  }
  console.log(`final total price ${totalPrice}`);
  return totalPrice;
};
