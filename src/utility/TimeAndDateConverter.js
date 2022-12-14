import * as shamsi from 'shamsi-date-converter';

function getDateFormat(uDate, option) {
  let date = new Intl.DateTimeFormat('fa-IR', option).format(uDate);
  return date;
}
const dateConvert = (date) => {
  const convertedDate = new Date(date);
  const solarDate = {
    day: getDateFormat(convertedDate, { day: '2-digit' }),
    month: getDateFormat(convertedDate, { month: 'numeric' }),
    monthTitle: getDateFormat(convertedDate, { month: 'long' }),
    year: getDateFormat(convertedDate, { year: 'numeric' }),
    dayWeek: getDateFormat(convertedDate, { weekday: 'long' }),
  };
  return solarDate;
};

const timeConvert = (date) => {
  const d = new Date(date);
  return d.toTimeString().slice(0, 5);
};

const solarDateArrange = (date) => {
  const year = date?.slice(0, 4);
  const month = date?.slice(5, 7);
  const day = date?.slice(8, 10);
  return `${year}/${month}/${day}`;
};

function toFarsiNumber(n) {
  const farsiDigits = [
    '۰',
    '۱',
    '۲',
    '۳',
    '۴',
    '۵',
    '۶',
    '۷',
    '۸',
    '۹',
  ];

  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
}

const convertDateToGregorian = (date) => {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const convertedDate = shamsi
    .jalaliToGregorian(year, month, day)
    .join('/');
  const d = new Date(convertedDate);
  return d;
};

export {
  dateConvert,
  timeConvert,
  solarDateArrange,
  toFarsiNumber,
  convertDateToGregorian,
};
