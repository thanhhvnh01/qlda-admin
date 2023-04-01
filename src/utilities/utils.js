import { startOfDay } from 'date-fns';
import { EmailPhoneNumberRegExp } from './constants';

export const enumToSelectOptions = (obj) => {
  const keys = Object.keys(obj);
  return keys.map((key) => ({
    id: obj[key],
    label: key,
  }));
};

export const arrayToSelectOptions = (arr, labelKey, valueKey, conditionKey, getAll = false) => {
  if (Array.isArray(arr)) {
    return arr.map((c) => {
      return {
        label: c[labelKey],
        id: c[valueKey],
        ...(!!conditionKey && {
          condition: c[conditionKey],
        }),
        ...(getAll && { item: c }),
      };
    });
  }
};

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
}

export const getCurrentTimeRange = (arr) => {
  const today = startOfDay(new Date().getTime());
  return arr.find((d) => today >= d.item.startAtUnix && today <= d.item.endAtUnix);
};
