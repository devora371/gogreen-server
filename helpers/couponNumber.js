const generateCouponNumber = (firstName, lastName, mobile, userId) => {
  const userNamePrefix = firstName.slice(0, 3).toUpperCase();
  const userNamelast = lastName.slice(0, 3).toUpperCase();
  const mobileDigits = mobile.slice(2, 8);
  const randomDigits = Math.floor(100000 + Math.random() * 900000);

  // Use userId as a unique identifier to ensure uniqueness
  // const uniqueIdentifier = userId.slice(-4); // Using the last 4 characters of userId

  const couponNumber = `${"MF"}-${userNamePrefix}-${mobileDigits}-${userNamelast}-${randomDigits}`;
  // -${uniqueIdentifier}`;
  return couponNumber;
};

module.exports = generateCouponNumber;
