import React from 'react';

//convert to dd Mon yyyy format
export const convertDateKh = (ISO801Str) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date(ISO801Str);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  //convert
  const newDate = day + ' ' + month + ' ' + year;
  // console.log(newDate);
  return newDate;
};

export const convertDateUs = (ISO801Str) => {
  const date = new Date(ISO801Str);

  // Make an object of format options
  const opt = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  // Convert
  const newDate = date.toLocaleDateString('en-US', opt);
  console.log(newDate);

  return newDate;
};

export const getMinPassed = (ISO801Str) => {
  const now = Date.now();
  //get time from the iso801
  const timestamp = new Date(ISO801Str).getTime();

  //Find milliseconds passed:
  const millisecondsPassed = now - timestamp;

  //convert the milliseconds into minute
  let minutesPassed = Math.floor(millisecondsPassed / (1000 * 60));
  const daysPassed = Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24));
  if (minutesPassed >= 60) {
    minutesPassed = minutesPassed % 60;
  }
  const newDate = { daysPassed: daysPassed, minsPassed: minutesPassed };
  console.log(minutesPassed, daysPassed);
  return newDate;
};


