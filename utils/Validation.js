export function validateName(firstName) {
  const letters = /^[A-Za-z]+$/;
  if (firstName != "" && firstName.match(letters)) {
    return true;
  } else {
    return false;
  }
  // if (!firstName) {setFirstNameError('Please enter a firstName');}
  // if (typeof firstName !== "string"){setFirstNameError('A firstName should only contain characters');} else {
  //     setFirstNameError('');
  //     nameIsValid = true;
}

export function validateEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

export function validateNumber(number) {
  if (isNaN(number)) {
    return false;
  } else if (number.length == 10) {
    return true;
  } else if (number.length > 10) {
    // Alert.alert("Phone number should not be more than 10 digits");
    return false;
  }
}
