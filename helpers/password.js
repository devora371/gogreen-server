const generateRandomPassword = (username, length = 12) => {
  const charset = "0123456789";
  let password = "";

  // Check if the username is defined, not null, and has at least 3 characters
  if (username && typeof username === "string" && username.trim().length >= 3) {
    // Trim the username to remove leading and trailing white spaces
    const trimmedUsername = username.trim();

    // Take the first three characters of the trimmed username
    const usernamePrefix = trimmedUsername.slice(0, 3);

    // Add the first three characters of the username to the password
    password += usernamePrefix;

    // Add random four-digit number to the password
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    // If the password length is greater than the desired length, truncate it
    password = password.slice(0, length);
  } else {
    // Handle the case where username is invalid
    console.error("Invalid username:", username);
    throw new Error(
      "Invalid username: Username should be at least 3 characters long"
    );
  }

  return password;
};

const generateUserRandomPassword = (firstName, length = 12) => {
  const charset = "0123456789";
  let password = "";
  console.log("username", firstName);

  // Check if the username is defined, not null, and has at least 3 characters
  if (
    firstName &&
    typeof firstName === "string" &&
    firstName.trim().length >= 3
  ) {
    // Trim the username to remove leading and trailing white spaces
    const trimmedUsername = firstName.trim();

    // Take the first three characters of the trimmed username
    const usernamePrefix = trimmedUsername.slice(0, 3);

    // Add the first three characters of the username to the password
    password += usernamePrefix;
  } else {
    // Handle the case where username is undefined, null, empty, or has less than 3 characters
    console.error("Invalid username:", firstName);
    throw new Error(
      "Invalid username: Username should be at least 3 characters long"
    );
  }

  // Add random four-digit number to the password
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // If the password length is greater than 12, truncate it to the desired length
  password = password.slice(0, length);
  console.log("user password", password);
  return password;
};

module.exports = { generateRandomPassword, generateUserRandomPassword };
